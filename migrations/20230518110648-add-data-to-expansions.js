'use strict';

var dbm;
var type;
var seed;

/**
  * We receive the dbmigrate dependency from dbmigrate initially.
  * This enables us to not have to rely on NODE_PATH.
  */
exports.setup = function(options, seedLink) {
  dbm = options.dbmigrate;
  type = dbm.dataType;
  seed = seedLink;
};

// add mock data
exports.up = function(db) {
  return db.runSql("INSERT into expansions (name) values ('Base Set'), ('Jungle'), ('Fossil'), ('Team Rocket'), ('Gym Heroes'), ('Gym Challenge'), ('Neo Genesis'), ('Neo Discovery'), ('Neo Revelation'), ('Neo Destiny'), ('Legendary Collection'), ('Expedition Base Set'), ('Aquapolis'), ('Skyridge'), ('EX Ruby & Sapphire'), ('EX Sandstorm'), ('EX Dragon'), ('EX Team Magma vs. Team Aqua'), ('EX Hidden Legends'), ('EX FireRed & LeafGreen'), ('EX Team Rocket Returns'), ('EX Deoxys'), ('EX Emerald'), ('EX Unseen Forces'), ('EX Delta Species'), ('EX Legend Maker'), ('EX Holon Phantoms'), ('EX Crystal Guardians'), ('EX Dragon Frontiers'), ('EX Power Keepers'), ('Diamond & Pearl'), ('Mysterious Treasures'), ('Secret Wonders'), ('Great Encounters'), ('Majestic Dawn'), ('Legends Awakened'), ('Stormfront'), ('Platinum'), ('Rising Rivals'), ('Supreme Victors'), ('Arceus'), ('HeartGold & SoulSilver'), ('Unleashed'), ('Undaunted'), ('Triumphant'), ('Call of Legends'), ('Black & White'), ('Emerging Powers'), ('Noble Victories'), ('Next Destinies')");
};

exports.down = function(db) {
  return null;
};

exports._meta = {
  "version": 1
};
