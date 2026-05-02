// -*- mode: js; js-indent-level: 4; indent-tabs-mode: nil -*-
/* exported getAppFavorites */

const Shell = imports.gi.Shell;
const ParentalControlsManager = imports.misc.parentalControlsManager;
const Signals = imports.signals;

const Main = imports.ui.main;

// In alphabetical order
const RENAMED_DESKTOP_IDS = {
    'baobab.desktop': 'io.github.scarecrow_de.baobab.desktop',
    'cheese.desktop': 'io.github.scarecrow_de.Cheese.desktop',
    'dconf-editor.desktop': 'ca.desrt.dconf-editor.desktop',
    'empathy.desktop': 'io.github.scarecrow_de.Empathy.desktop',
    'eog.desktop': 'io.github.scarecrow_de.eog.desktop',
    'epiphany.desktop': 'io.github.scarecrow_de.Epiphany.desktop',
    'evolution.desktop': 'io.github.scarecrow_de.Evolution.desktop',
    'file-roller.desktop': 'io.github.scarecrow_de.FileRoller.desktop',
    'five-or-more.desktop': 'io.github.scarecrow_de.five-or-more.desktop',
    'four-in-a-row.desktop': 'io.github.scarecrow_de.Four-in-a-row.desktop',
    'gcalctool.desktop': 'io.github.scarecrow_de.Calculator.desktop',
    'geary.desktop': 'io.github.scarecrow_de.Geary.desktop',
    'gedit.desktop': 'io.github.scarecrow_de.gedit.desktop',
    'glchess.desktop': 'io.github.scarecrow_de.Chess.desktop',
    'glines.desktop': 'io.github.scarecrow_de.five-or-more.desktop',
    'gnect.desktop': 'io.github.scarecrow_de.Four-in-a-row.desktop',
    'gnibbles.desktop': 'io.github.scarecrow_de.Nibbles.desktop',
    'gnobots2.desktop': 'io.github.scarecrow_de.Robots.desktop',
    'gnome-boxes.desktop': 'io.github.scarecrow_de.Boxes.desktop',
    'gnome-calculator.desktop': 'io.github.scarecrow_de.Calculator.desktop',
    'gnome-chess.desktop': 'io.github.scarecrow_de.Chess.desktop',
    'gnome-clocks.desktop': 'io.github.scarecrow_de.clocks.desktop',
    'gnome-contacts.desktop': 'io.github.scarecrow_de.Contacts.desktop',
    'gnome-documents.desktop': 'io.github.scarecrow_de.Documents.desktop',
    'gnome-font-viewer.desktop': 'io.github.scarecrow_de.font-viewer.desktop',
    'gnome-klotski.desktop': 'io.github.scarecrow_de.Klotski.desktop',
    'gnome-nibbles.desktop': 'io.github.scarecrow_de.Nibbles.desktop',
    'gnome-mahjongg.desktop': 'io.github.scarecrow_de.Mahjongg.desktop',
    'gnome-mines.desktop': 'io.github.scarecrow_de.Mines.desktop',
    'gnome-music.desktop': 'io.github.scarecrow_de.Music.desktop',
    'gnome-photos.desktop': 'io.github.scarecrow_de.Photos.desktop',
    'gnome-robots.desktop': 'io.github.scarecrow_de.Robots.desktop',
    'gnome-screenshot.desktop': 'io.github.scarecrow_de.Screenshot.desktop',
    'gnome-software.desktop': 'io.github.scarecrow_de.Software.desktop',
    'gnome-terminal.desktop': 'io.github.scarecrow_de.Terminal.desktop',
    'gnome-tetravex.desktop': 'io.github.scarecrow_de.Tetravex.desktop',
    'gnome-tweaks.desktop': 'io.github.scarecrow_de.tweaks.desktop',
    'gnome-weather.desktop': 'io.github.scarecrow_de.Weather.desktop',
    'gnomine.desktop': 'io.github.scarecrow_de.Mines.desktop',
    'gnotravex.desktop': 'io.github.scarecrow_de.Tetravex.desktop',
    'gnotski.desktop': 'io.github.scarecrow_de.Klotski.desktop',
    'gtali.desktop': 'io.github.scarecrow_de.Tali.desktop',
    'iagno.desktop': 'io.github.scarecrow_de.Reversi.desktop',
    'nautilus.desktop': 'io.github.scarecrow_de.Nautilus.desktop',
    'io.github.scarecrow_de.gnome-2048.desktop': 'io.github.scarecrow_de.TwentyFortyEight.desktop',
    'io.github.scarecrow_de.taquin.desktop': 'io.github.scarecrow_de.Taquin.desktop',
    'io.github.scarecrow_de.Weather.Application.desktop': 'io.github.scarecrow_de.Weather.desktop',
    'polari.desktop': 'io.github.scarecrow_de.Polari.desktop',
    'seahorse.desktop': 'io.github.scarecrow_de.seahorse.Application.desktop',
    'shotwell.desktop': 'io.github.scarecrow_de.Shotwell.desktop',
    'tali.desktop': 'io.github.scarecrow_de.Tali.desktop',
    'totem.desktop': 'io.github.scarecrow_de.Totem.desktop',
    'evince.desktop': 'io.github.scarecrow_de.Evince.desktop',
};

class AppFavorites {
    constructor() {
        // Filter the apps through the user’s parental controls.
        this._parentalControlsManager = ParentalControlsManager.getDefault();
        this._parentalControlsManager.connect('app-filter-changed', () => {
            this.reload();
            this.emit('changed');
        });

        this.FAVORITE_APPS_KEY = 'favorite-apps';
        this._favorites = {};
        global.settings.connect('changed::%s'.format(this.FAVORITE_APPS_KEY), this._onFavsChanged.bind(this));
        this.reload();
    }

    _onFavsChanged() {
        this.reload();
        this.emit('changed');
    }

    reload() {
        let ids = global.settings.get_strv(this.FAVORITE_APPS_KEY);
        let appSys = Shell.AppSystem.get_default();

        // Map old desktop file names to the current ones
        let updated = false;
        ids = ids.map(id => {
            let newId = RENAMED_DESKTOP_IDS[id];
            if (newId !== undefined &&
                appSys.lookup_app(newId) != null) {
                updated = true;
                return newId;
            }
            return id;
        });
        // ... and write back the updated desktop file names
        if (updated)
            global.settings.set_strv(this.FAVORITE_APPS_KEY, ids);

        let apps = ids.map(id => appSys.lookup_app(id))
                      .filter(app => app !== null && this._parentalControlsManager.shouldShowApp(app.app_info));
        this._favorites = {};
        for (let i = 0; i < apps.length; i++) {
            let app = apps[i];
            this._favorites[app.get_id()] = app;
        }
    }

    _getIds() {
        let ret = [];
        for (let id in this._favorites)
            ret.push(id);
        return ret;
    }

    getFavoriteMap() {
        return this._favorites;
    }

    getFavorites() {
        let ret = [];
        for (let id in this._favorites)
            ret.push(this._favorites[id]);
        return ret;
    }

    isFavorite(appId) {
        return appId in this._favorites;
    }

    _addFavorite(appId, pos) {
        if (appId in this._favorites)
            return false;

        let app = Shell.AppSystem.get_default().lookup_app(appId);

        if (!app)
            return false;

        if (!this._parentalControlsManager.shouldShowApp(app.app_info))
            return false;

        let ids = this._getIds();
        if (pos == -1)
            ids.push(appId);
        else
            ids.splice(pos, 0, appId);
        global.settings.set_strv(this.FAVORITE_APPS_KEY, ids);
        return true;
    }

    addFavoriteAtPos(appId, pos) {
        if (!this._addFavorite(appId, pos))
            return;

        let app = Shell.AppSystem.get_default().lookup_app(appId);

        let msg = _("%s has been added to your favorites.").format(app.get_name());
        Main.overview.setMessage(msg, {
            forFeedback: true,
            undoCallback: () => this._removeFavorite(appId),
        });
    }

    addFavorite(appId) {
        this.addFavoriteAtPos(appId, -1);
    }

    moveFavoriteToPos(appId, pos) {
        this._removeFavorite(appId);
        this._addFavorite(appId, pos);
    }

    _removeFavorite(appId) {
        if (!(appId in this._favorites))
            return false;

        let ids = this._getIds().filter(id => id != appId);
        global.settings.set_strv(this.FAVORITE_APPS_KEY, ids);
        return true;
    }

    removeFavorite(appId) {
        let ids = this._getIds();
        let pos = ids.indexOf(appId);

        let app = this._favorites[appId];
        if (!this._removeFavorite(appId))
            return;

        let msg = _("%s has been removed from your favorites.").format(app.get_name());
        Main.overview.setMessage(msg, {
            forFeedback: true,
            undoCallback: () => this._addFavorite(appId, pos),
        });
    }
}
Signals.addSignalMethods(AppFavorites.prototype);

var appFavoritesInstance = null;
function getAppFavorites() {
    if (appFavoritesInstance == null)
        appFavoritesInstance = new AppFavorites();
    return appFavoritesInstance;
}
