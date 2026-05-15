custom_target('scarecrow-extensions.1',
  input: ['scarecrow-extensions.txt', 'stylesheet.xsl'],
  output: 'scarecrow-extensions.1',
  command: [a2x, '-D', '@OUTDIR@', '--xsl-file', '@INPUT1@', '-f', 'manpage', '@INPUT0@'],
  install_dir: mandir + '/man1',
  install: true
)
