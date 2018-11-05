const fs = require('fs');

const command = process.argv[2];
const title = process.argv[3];
const index = process.argv[3];
const content = process.argv[4];

switch (command) {
    case 'list':
        list((error, notes) => {
            if (error) return console.error(error.message);

            if (notes.length === 0) return console.log('Заметок пока нет');
            notes.forEach((note, index) => {
                console.log(`${index + 1}. ${note.title}`);
            });
        });
        break;
    case 'view':
        view(title, (error, note) => {
            if (error) return console.error(error.message);

            console.log(`# ${note.title}\r\n\r\n---\r\n\r\n${note.content}`);
        });
        break;
    case 'viewByIndex':
        viewByIndex(index, (error, note) => {
            if (error) return console.error(error.message);

            console.log(`# ${note.title}\r\n\r\n---\r\n\r\n${note.content}`);
        });
        break;
    case 'create':
        create(title, content, error => {
            if (error) return console.error(error.message);

            console.log('Заметка создана');
        });
        break;
    case 'remove':
        remove(title, error => {
            if (error) return console.error(error.message);
            
            console.log('Заметка удалена');
        });
        break;
    case 'removeByIndex':
        removeByIndex(index, error => {
            if (error) return console.error(error.message);

            console.log('Заметка удалена');
        });
        break;
    case 'removeAll':
        removeAll(error => {
            if (error) return console.error(error.message);

            console.log('Все заметки удалены');
        });
        break;
    default:
        console.error('Неизвестная команда');
        break;
}

function list(done) {
    load(done);
}
function view(title, done) {
    load((error, notes) => {
        if (error) return done(error);

        const note = notes.find(note => note.title === title);

        if (!note) return done(new Error('Заметка не найдена'));
        
        done(null, note);
    })
}
function viewByIndex(index, done) {
    load((error, notes) => {
        if (error) return done(error);

        if (!note) return done(new Error('Заметка не найдена'));
        
        done(null, notes[index - 1]);
    })
}
function create(title, content, done) {
    load((error, notes) => {
        if (error) return done(error);

        notes.push({title, content});
        save(notes, done);
    })
}
function remove(title, done) {
    load((error, notes) => {
        if (error) return done(error);

        notes = notes.filter(note => note.title !== title);
        save(notes, done);
    })
}
function removeByIndex(index, done) {
    load((error, notes) => {
        if (error) return done(error);

        notes.splice(index - 1, index);
        save(notes, done);
    })
}
function removeAll(done) {
    load((error, notes) => {
        if (error) return done(error);

        notes.splice(0, notes.length);
        save(notes, done);
    })
}
function load(done) {
    fs.readFile('notes.json', (error, data) => {
        if (error) {
            if (error.code === 'ENOENT') {
                return done(null, []);
            }else{
                return done(error);
            }
        }

        try {
            const notes = JSON.parse(data);
            done(null, notes);
        } catch (error) {
            done(error);
        }
    });
}

function save(notes, done) {
    try {
        const json = JSON.stringify(notes);
        fs.writeFile('notes.json', json, error => {
            if (error) return done(error);

            done();
        })
    } catch (error) {
        done(error);
    }
}