theme_sources = files([
  'scarecrow-shell-high-contrast.scss',
  'scarecrow-shell.scss',
  'scarecrow-shell-sass/_colors.scss',
  'scarecrow-shell-sass/_common.scss',
  'scarecrow-shell-sass/_drawing.scss',
  'scarecrow-shell-sass/_high-contrast-colors.scss',
  'scarecrow-shell-sass/_widgets.scss',
  'scarecrow-shell-sass/widgets/_a11y.scss',
  'scarecrow-shell-sass/widgets/_app-grid.scss',
  'scarecrow-shell-sass/widgets/_base.scss',
  'scarecrow-shell-sass/widgets/_buttons.scss',
  'scarecrow-shell-sass/widgets/_calendar.scss',
  'scarecrow-shell-sass/widgets/_check-box.scss',
  'scarecrow-shell-sass/widgets/_corner-ripple.scss',
  'scarecrow-shell-sass/widgets/_dash.scss',
  'scarecrow-shell-sass/widgets/_dialogs.scss',
  'scarecrow-shell-sass/widgets/_entries.scss',
  'scarecrow-shell-sass/widgets/_hotplug.scss',
  'scarecrow-shell-sass/widgets/_ibus-popup.scss',
  'scarecrow-shell-sass/widgets/_keyboard.scss',
  'scarecrow-shell-sass/widgets/_login-dialog.scss',
  'scarecrow-shell-sass/widgets/_looking-glass.scss',
  'scarecrow-shell-sass/widgets/_message-list.scss',
  'scarecrow-shell-sass/widgets/_misc.scss',
  'scarecrow-shell-sass/widgets/_network-dialog.scss',
  'scarecrow-shell-sass/widgets/_notifications.scss',
  'scarecrow-shell-sass/widgets/_osd.scss',
  'scarecrow-shell-sass/widgets/_overview.scss',
  'scarecrow-shell-sass/widgets/_panel.scss',
  'scarecrow-shell-sass/widgets/_popovers.scss',
  'scarecrow-shell-sass/widgets/_screen-shield.scss',
  'scarecrow-shell-sass/widgets/_scrollbars.scss',
  'scarecrow-shell-sass/widgets/_search-entry.scss',
  'scarecrow-shell-sass/widgets/_search-results.scss',
  'scarecrow-shell-sass/widgets/_slider.scss',
  'scarecrow-shell-sass/widgets/_switcher-popup.scss',
  'scarecrow-shell-sass/widgets/_switches.scss',
  'scarecrow-shell-sass/widgets/_tiled-previews.scss',
  'scarecrow-shell-sass/widgets/_window-picker.scss',
  'scarecrow-shell-sass/widgets/_workspace-switcher.scss',
  'scarecrow-shell-sass/widgets/_workspace-thumbnails.scss'
])

styles = [
  'scarecrow-shell-high-contrast',
  'scarecrow-shell'
]

theme_deps = []

foreach style: styles
  theme_deps += custom_target('style-' + style,
                              input: '@0@.scss'.format(style),
                              output: '@0@.css'.format(style),
                              command: [
                                sassc, '-a', '@INPUT@', '@OUTPUT@'
                              ],
                              depend_files: theme_sources)
endforeach

