// -*- mode: js; js-indent-level: 4; indent-tabs-mode: nil -*-
/* exported PresenceStatus, Presence, Inhibitor, SessionManager */

const Gio = imports.gi.Gio;

const { loadInterfaceXML } = imports.misc.fileUtils;

const PresenceIface = loadInterfaceXML('io.github.scarecrow_de.SessionManager.Presence');

var PresenceStatus = {
    AVAILABLE: 0,
    INVISIBLE: 1,
    BUSY: 2,
    IDLE: 3,
};

var PresenceProxy = Gio.DBusProxy.makeProxyWrapper(PresenceIface);
function Presence(initCallback, cancellable) {
    return new PresenceProxy(Gio.DBus.session, 'io.github.scarecrow_de.SessionManager',
                             '/io/github/scarecrow_de/SessionManager/Presence', initCallback, cancellable);
}

// Note inhibitors are immutable objects, so they don't
// change at runtime (changes always come in the form
// of new inhibitors)
const InhibitorIface = loadInterfaceXML('io.github.scarecrow_de.SessionManager.Inhibitor');
var InhibitorProxy = Gio.DBusProxy.makeProxyWrapper(InhibitorIface);
function Inhibitor(objectPath, initCallback, cancellable) {
    return new InhibitorProxy(Gio.DBus.session, 'io.github.scarecrow_de.SessionManager', objectPath, initCallback, cancellable);
}

// Not the full interface, only the methods we use
const SessionManagerIface = loadInterfaceXML('io.github.scarecrow_de.SessionManager');
var SessionManagerProxy = Gio.DBusProxy.makeProxyWrapper(SessionManagerIface);
function SessionManager(initCallback, cancellable) {
    return new SessionManagerProxy(Gio.DBus.session, 'io.github.scarecrow_de.SessionManager', '/io/github/scarecrow_de/SessionManager', initCallback, cancellable);
}
