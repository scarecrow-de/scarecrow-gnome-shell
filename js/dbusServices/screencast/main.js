/* exported main */

const { DBusService } = imports.dbusService;
const { ScreencastService } = imports.screencastService;

function main() {
    const service = new DBusService(
        'io.github.scarecrow-de.Shell.Screencast',
        new ScreencastService());
    service.run();
}
