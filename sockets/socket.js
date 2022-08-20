const { io } = require('../index');
const Band = require('../models/band');
const Bands = require('../models/bands');

const bands = new Bands();
console.log('Init Server');

bands.addBand(new Band('Cattle Decapitation'));
bands.addBand(new Band('HLB'));
bands.addBand(new Band('Vildhjarta'));
bands.addBand(new Band('Soreption'));

// Message Socket
io.on('connection', client => {

    console.log(bands.getBands());
    
    client.emit('active-bands', bands.getBands());

    client.on('disconnect', () => {
        console.log('Disconnect Io');
    });

    client.on('message', (payload) => {
        console.log('message', payload)
        io.emit('message', { admin: 'New message' })
    })
    
    client.on('vote-band', (payload) => {
        bands.voteBand(payload.id);
        io.emit('active-bands', bands.getBands())
    })
    
    client.on('create-band', (payload) => {
        bands.addBand(new Band(payload.name))
        io.emit('active-bands', bands.getBands())
    })

    client.on('delete-band', (payload) => {
        bands.deleteBand(payload.id)
        io.emit('active-bands', bands.getBands())
    })
});