// Simple application to bind zbar with JavaScript/emscripten
// Copyright (C) 2013 Yury Delendik
//
// This library is free software; you can redistribute it and/or
// modify it under the terms of the GNU Lesser General Public
// License as published by the Free Software Foundation; either
// version 2.1 of the License, or (at your option) any later version.
//
// This library is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU
// Lesser General Public License for more details.
//
// You should have received a copy of the GNU Lesser General Public
// License along with this library; if not, write to the Free Software
// Foundation, Inc., 51 Franklin Street, Fifth Floor, Boston, MA  02110-1301  USA

#include <config.h>
#include <stdlib.h>
#include <assert.h>
#include <zbar.h>

static zbar_processor_t *processor = NULL;

extern int js_get_width();
extern int js_get_height();
extern int js_read_image(unsigned char *data, size_t len);
extern void js_output_result(const char *symbolName, const char *addonName, const char *data);

int main (int argc, const char *argv[])
{
  processor = zbar_processor_create(0);
  assert(processor);
  if(zbar_processor_init(processor, NULL, 0)) {
      zbar_processor_error_spew(processor, 0);
      return(1);
  }

  zbar_image_t *zimage = zbar_image_create();
  assert(zimage);
  zbar_image_set_format(zimage, *(unsigned long*)"Y800");

  int width = js_get_width();
  int height = js_get_height();
  zbar_image_set_size(zimage, width, height);

  size_t bloblen = width * height;
  unsigned char *blob = malloc(bloblen);
  zbar_image_set_data(zimage, blob, bloblen, zbar_image_free_data);

  js_read_image(blob, bloblen);

  zbar_process_image(processor, zimage);

  // print results
  const zbar_symbol_t *sym = zbar_image_first_symbol(zimage);
  for(; sym; sym = zbar_symbol_next(sym)) {
      zbar_symbol_type_t typ = zbar_symbol_get_type(sym);
      if(typ == ZBAR_PARTIAL)
          continue;
      js_output_result(zbar_get_symbol_name(typ),
                       zbar_get_addon_name(typ),
                       zbar_symbol_get_data(sym));
  }

  zbar_image_destroy(zimage);

  if(zbar_processor_is_visible(processor)) {
     zbar_processor_user_wait(processor, -1);
  }

  zbar_processor_destroy(processor);

  return 0;
}

