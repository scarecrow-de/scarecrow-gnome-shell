private_headers = [
  'gactionmuxer.h',
  'gactionobservable.h',
  'gactionobserver.h',
  'shell-network-agent.h',
]

exclude_directories = [
  'calendar-server',
  'hotplug-sniffer',
  'st',
  'tray'
]

ifaces = [
  ['io.github.scarecrow_de.Shell.Screenshot', 'io.github.scarecrow_de.Shell.Screenshot.xml'],
  ['io.github.scarecrow_de.ShellSearchProvider', 'io.github.scarecrow_de.Shell.SearchProvider.xml'],
  ['io.github.scarecrow_de.ShellSearchProvider2', 'io.github.scarecrow_de.Shell.SearchProvider2.xml']
]
foreach iface : ifaces
  custom_target(iface[0] + ' docs',
    input: '../../../data/dbus-interfaces/@0@.xml'.format(iface[0]),
    output: 'doc-gen-' + iface[1],
    command: [
      'gdbus-codegen',
      '--interface-prefix=@0@.'.format(iface[0]),
      '--generate-docbook', 'doc-gen',
      '--output-directory', '@OUTDIR@',
      '@INPUT@'
    ],
    build_by_default: true
  )
endforeach

configure_file(
  input: 'version.xml.in',
  output: 'version.xml',
  configuration: version_conf
)

gnome.gtkdoc('shell',
  main_sgml: 'shell-docs.sgml',
  src_dir: [
    join_paths(meson.source_root(), 'src'),
    join_paths(meson.build_root(), 'src')
  ],
  scan_args: [
    '--ignore-headers=' + ' '.join(private_headers + exclude_directories)
  ],
  install: true
)
