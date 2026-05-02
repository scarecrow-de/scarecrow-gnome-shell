/* exported main */

const { DBusService } = imports.dbusService;
const { NotificationDaemon } = imports.notificationDaemon;

function main() {
    const service = new DBusService(
        'io.github.scarecrow_de.Shell.Notifications',
        new NotificationDaemon());
    service.run();
}
