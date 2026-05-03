calendar_sources = [
  'scarecrow-shell-calendar-server.c',
  'calendar-debug.h',
  'calendar-sources.c',
  'calendar-sources.h'
]

calendar_server = executable('scarecrow-shell-calendar-server', calendar_sources,
  dependencies: [ecal_dep, eds_dep, gio_dep],
  include_directories: include_directories('..', '../..'),
  c_args: [
    '-DPREFIX="@0@"'.format(prefix),
    '-DLIBDIR="@0@"'.format(libdir),
    '-DDATADIR="@0@"'.format(datadir),
    '-DG_LOG_DOMAIN="ShellCalendarServer"'
  ],
  install_dir: libexecdir,
  install: true
)

service_file = 'io.github.scarecrow_de.Shell.CalendarServer.service'

configure_file(
  input: service_file + '.in',
  output: service_file,
  configuration: service_data,
  install_dir: servicedir
)

i18n.merge_file(
  input: 'evolution-calendar.desktop.in',
  output: 'evolution-calendar.desktop',
  po_dir: po_dir,
  install: true,
  install_dir: desktopdir,
  type: 'desktop'
)
