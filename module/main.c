#include <emscripten.h>
#include <libexif/exif-content.h>
#include <libexif/exif-data.h>
#include <libexif/exif-entry.h>
#include <libexif/exif-utils.h>

/* Macros */
// <libexif/exif-data.h>
EMSCRIPTEN_KEEPALIVE
ExifEntry *_exif_data_get_entry(ExifData *d, ExifTag t) {
  return exif_data_get_entry(d, t);
}

// <libexif/exif-entry.h>
EMSCRIPTEN_KEEPALIVE
ExifIfd _exif_entry_get_ifd(const ExifEntry *e) {
  return exif_entry_get_ifd(e);
}

// <libexif/exif-log.h>
EMSCRIPTEN_KEEPALIVE
void _EXIF_LOG_NO_MEMORY(ExifLog *l, const char *d, size_t s) {
  EXIF_LOG_NO_MEMORY(l, d, s);
}

/* Struct getters/setters */
// ExifContent
EMSCRIPTEN_KEEPALIVE
ExifEntry **_exif_content_get_entries(ExifContent *c) { return c->entries; }

EMSCRIPTEN_KEEPALIVE
void _exif_content_set_entries(ExifContent *c, ExifEntry **e) {
  c->entries = e;
}

EMSCRIPTEN_KEEPALIVE
unsigned int _exif_content_get_count(ExifContent *c) { return c->count; }

EMSCRIPTEN_KEEPALIVE
void _exif_content_set_count(ExifContent *c, unsigned int ct) { c->count = ct; }

EMSCRIPTEN_KEEPALIVE
ExifData *_exif_content_get_parent(ExifContent *c) { return c->parent; }

EMSCRIPTEN_KEEPALIVE
void _exif_content_set_parent(ExifContent *c, ExifData *p) { c->parent = p; }

// ExifData
EMSCRIPTEN_KEEPALIVE
ExifContent *_exif_data_get_ifd(ExifData *d, ExifIfd i) { return d->ifd[i]; }

EMSCRIPTEN_KEEPALIVE
void _exif_data_set_ifd(ExifData *d, ExifIfd i, ExifContent *c) {
  d->ifd[i] = c;
}

EMSCRIPTEN_KEEPALIVE
unsigned char *_exif_data_get_data(ExifData *d) { return d->data; }

EMSCRIPTEN_KEEPALIVE
void _exif_data_set_data(ExifData *d, unsigned char *dt) { d->data = dt; }

EMSCRIPTEN_KEEPALIVE
unsigned int _exif_data_get_size(ExifData *d) { return d->size; }

EMSCRIPTEN_KEEPALIVE
void _exif_data_set_size(ExifData *d, unsigned int s) { d->size = s; }

// ExifEntry
EMSCRIPTEN_KEEPALIVE
ExifTag _exif_entry_get_tag(ExifEntry *e) { return e->tag; }

EMSCRIPTEN_KEEPALIVE
void _exif_entry_set_tag(ExifEntry *e, ExifTag t) { e->tag = t; }

EMSCRIPTEN_KEEPALIVE
ExifFormat _exif_entry_get_format(ExifEntry *e) { return e->format; }

EMSCRIPTEN_KEEPALIVE
void _exif_entry_set_format(ExifEntry *e, ExifFormat f) { e->format = f; }

EMSCRIPTEN_KEEPALIVE
unsigned long _exif_entry_get_components(ExifEntry *e) { return e->components; }

EMSCRIPTEN_KEEPALIVE
void _exif_entry_set_components(ExifEntry *e, unsigned long c) {
  e->components = c;
}

EMSCRIPTEN_KEEPALIVE
unsigned char *_exif_entry_get_data(ExifEntry *e) { return e->data; }

EMSCRIPTEN_KEEPALIVE
void _exif_entry_set_data(ExifEntry *e, unsigned char *d) { e->data = d; }

EMSCRIPTEN_KEEPALIVE
unsigned int _exif_entry_get_size(ExifEntry *e) { return e->size; }

EMSCRIPTEN_KEEPALIVE
void _exif_entry_set_size(ExifEntry *e, unsigned int s) { e->size = s; }

EMSCRIPTEN_KEEPALIVE
ExifContent *_exif_entry_get_parent(ExifEntry *e) { return e->parent; }

EMSCRIPTEN_KEEPALIVE
void _exif_entry_set_parent(ExifEntry *e, ExifContent *p) { e->parent = p; }

// ExifRational
EMSCRIPTEN_KEEPALIVE
ExifLong _exif_rational_get_numerator(ExifRational *r) { return r->numerator; }

EMSCRIPTEN_KEEPALIVE
void _exif_rational_set_numerator(ExifRational *r, ExifLong n) {
  r->numerator = n;
}

EMSCRIPTEN_KEEPALIVE
ExifLong _exif_rational_get_denominator(ExifRational *r) {
  return r->denominator;
}

EMSCRIPTEN_KEEPALIVE
void _exif_rational_set_denominator(ExifRational *r, ExifLong d) {
  r->denominator = d;
}

// ExifSRational
EMSCRIPTEN_KEEPALIVE
ExifLong _exif_srational_get_numerator(ExifSRational *s) {
  return s->numerator;
}

EMSCRIPTEN_KEEPALIVE
void _exif_srational_set_numerator(ExifSRational *s, ExifLong n) {
  s->numerator = n;
}

EMSCRIPTEN_KEEPALIVE
ExifLong _exif_srational_get_denominator(ExifSRational *s) {
  return s->denominator;
}

EMSCRIPTEN_KEEPALIVE
void _exif_srational_set_denominator(ExifSRational *s, ExifLong d) {
  s->denominator = d;
}
