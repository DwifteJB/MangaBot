const checkPath = cwd => {
    let p;
    if (cwd.includes('\\')) {
        p = cwd.split('\\');
        p = p.join('/');
    } else {
        p = cwd;
    }
    return 'sqlite://' + p + '/src/database.sqlite';
}
const sqlite = checkPath(process.cwd());

const Keyv = require('keyv');
const Settings = new Keyv(sqlite, {
    namespace: 'Users'
});

async function CreateDefault(userID) {
    if (await Settings.get(userID) == null) {
        Settings.set(userID,{"api":"Kitsu"})
    }
}

module.exports = {sqlite,CreateDefault};