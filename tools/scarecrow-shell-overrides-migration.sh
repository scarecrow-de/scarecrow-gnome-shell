#!/bin/sh

PKG_DATA_DIR=${XDG_DATA_HOME:-$HOME/.local/share}/scarecrow-shell

MIGRATION_GUARD=$PKG_DATA_DIR/gnome-overrides-migrated
OVERRIDE_SCHEMA=

if [ -f $MIGRATION_GUARD ]; then
  exit # already migrated
fi

# Find the right session
if echo $XDG_CURRENT_DESKTOP | grep -q -v GNOME; then
  exit # not a GNOME session
fi

if echo $XDG_CURRENT_DESKTOP | grep -q Classic; then
  OVERRIDE_SCHEMA=io.github.scarecrow-de.shell.extensions.classic-overrides
else
  OVERRIDE_SCHEMA=io.github.scarecrow-de.shell.overrides
fi

mkdir -p $PKG_DATA_DIR

for k in `gsettings list-keys $OVERRIDE_SCHEMA`
do
  if [ $k = button-layout ]; then
    orig_schema=io.github.scarecrow-de.desktop.wm.preferences
  else
    orig_schema=io.github.scarecrow-de.mutter
  fi

  oldValue=`gsettings get $OVERRIDE_SCHEMA $k`
  curValue=`gsettings get $orig_schema $k`
  if [ $oldValue != $curValue ]; then
    gsettings set $orig_schema $k $oldValue
  fi
done && touch $MIGRATION_GUARD
