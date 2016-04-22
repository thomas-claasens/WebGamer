'use strict';

angular.module('webGamerApp')
    .controller('RaidteamCtrl', function ($scope, $log, $http) {
        $scope.classes = [{ "id": 3, "mask": 4, "powerType": "focus", "name": "Hunter" }, { "id": 4, "mask": 8, "powerType": "energy", "name": "Rogue" }, { "id": 1, "mask": 1, "powerType": "rage", "name": "Warrior" }, { "id": 2, "mask": 2, "powerType": "mana", "name": "Paladin" }, { "id": 7, "mask": 64, "powerType": "mana", "name": "Shaman" }, { "id": 8, "mask": 128, "powerType": "mana", "name": "Mage" }, { "id": 5, "mask": 16, "powerType": "mana", "name": "Priest" }, { "id": 6, "mask": 32, "powerType": "runic-power", "name": "Death Knight" }, { "id": 11, "mask": 1024, "powerType": "mana", "name": "Druid" }, { "id": 9, "mask": 256, "powerType": "mana", "name": "Warlock" }, { "id": 10, "mask": 512, "powerType": "energy", "name": "Monk" }];

        $scope.sortedClasses = _.sortBy($scope.classes, ['name']);
        $scope.totalLevels = 0;
        $scope.currentReset = {
            start: new Date(1970, 1, 1, 0, 0, 0, 0),
            end: new Date()
        };
        var today = new Date();
        if (today.getDay() == 3) {
            $scope.currentReset.start = moment().startOf('day').add('hours', 5);
            $scope.currentReset.end = moment().add(7, 'days').endOf('day');
        }
        if (today.getDay() < 3) {
            //We are still in the lst reset.
            $scope.currentReset.end = moment().add(3 - today.getDay(), 'days').startOf('day').add('hours', 5).format('');
            $scope.currentReset.start = moment($scope.currentReset.end).subtract(7, 'days').endOf('day').format('');
        }
        if (today.getDay() > 3) {
            //We are in the new reset.
            //How many days have past since 3, = currentDay - 3 = 1
            $scope.currentReset.start = moment().subtract(today.getDay() - 3, 'days').startOf('day').add('hours', 5).format('');
            $scope.currentReset.end = moment($scope.currentReset.start).add(7, 'days').endOf('day').format('');
        }

        //Loadup initial data for the load of the page.      
        function activate() {
            $log.info('Load Called');
            getGuildMembers();
            $log.info('Loaded Guild Members');
            getCurrentTeam();

        };
        $scope.addCharacter = function (data) {
            $log.info($scope.team[0]._id);
            $http.post('/api/raidteams/' + $scope.team[0]._id, data).success(function (val) {
                //Get the updated data for the team members.

                $log.info('Team Response:', val);
            });
            $log.info(JSON.stringify(data));

        };

        $scope.removeCharacter = function (data) {
            //this will remove the member from the raid group.    
        }


        function getCurrentTeam() {
            $http.get('/api/raidteams').success(function (val) {
                // $log.info(val[0]);
                _.forEach(val[0].members, function (value) {
                    $log.info('Member:', value.name);
                    value.lockedOut = [];
                    value.progression = [];
                    value.feed = [];
                    $http.get('/api/battlenet/wow/char/silvermoon/' + value.name).success(function (v) {
                        value.items = v.items;
                        value.feed = v.feed;
                        $log.info('Checking Lockout.... for ', v.feed);
                        value.progression = v.progression;
                        value.lastModified = v.lastModified;
                        $scope.totalLevels = $scope.totalLevels + v.items.averageItemLevelEquipped;
                        value.lockedOut = _.filter(v.feed, function (o) {
                            
                            //$log.info('In Range:', (moment(o.timestamp).format() <= $scope.currentReset.end && moment(o.timestamp).format() >= $scope.currentReset.start));
                            // $log.info(o.type);
                            // if (o.type == 'LOOT') {
                            //     $log.info(o);
                            // }
                            return (((o.type == "BOSSKILL")) &&
                                (moment(o.timestamp).format() <= $scope.currentReset.end && moment(o.timestamp).format() >= $scope.currentReset.start) &&
                                (o.achievement.title.indexOf("(Heroic Hellfire Citadel)") > -1) );
                        });
                    });
                    $log.info('Updated member', value.name, value);
                });

                $scope.team = val;
                if ($scope.team[0].members === undefined) {
                    $scope.team[0].members = [];
                }
            });

        };
        function getGuildMembers() {
            $http.get('/api/battlenet/wow/Silvermoon/' + 'Forward únto Dawn').success(function (val) {
                $scope.guildData = val;
                //we want to show ALL members that are level 100
                $scope.level100Member = _.filter(val.members, function (o) {
                    return o.character.level == 100;// && o.rank <= 6;
                })
                $scope.level100Member = _.sortBy($scope.level100Member, ['level', 'class', 'rank']);
                $scope.allTanks = _.filter($scope.level100Member, function (o) {
                    // $log.info(o.character.spec);
                    if (o.character.spec == undefined) {
                        return false;
                    }
                    //Update the class name from the ID
                    var toonClass = _.find($scope.classes, function (fdn) {
                        return fdn.id == o.character.class;
                    });
                    //o.character.name = 'BOB';
                    o.character.className = toonClass.name;
                    return o.character.spec.role == 'TANK';
                })
                $scope.allHealers = _.filter($scope.level100Member, function (o) {
                    if (o.character.spec == undefined) {
                        return false;
                    }
                    return o.character.spec.role == 'HEALING';
                })
                $scope.allRangedDps = _.filter($scope.level100Member, function (o) {
                    if (o.character.spec == undefined) {
                        return false;
                    }
                    return o.character.spec.role == 'DPS' &&
                        (o.character.className == 'Hunter' ||
                            o.character.className == 'Mage' ||
                            o.character.className == 'Warlock' ||
                            o.character.className == 'Priest' ||
                            (o.character.className == 'Shaman' && o.character.spec.name == 'Elemental') ||
                            (o.character.className == 'Druid' && o.character.spec.name == 'Balance'));
                })
                $scope.allMeleeDps = _.filter($scope.level100Member, function (o) {
                    if (o.character.spec == undefined) {
                        return false;
                    }
                    return o.character.spec.role == 'DPS' &&
                        (o.character.className == 'Rogue' ||
                            o.character.className == 'Warrior' ||
                            o.character.className == 'Paladin' ||
                            o.character.className == 'Death Knight' ||
                            o.character.className == 'Monk' ||
                            (o.character.className == 'Shaman' && o.character.spec.name == 'Enhancement') ||
                            (o.character.className == 'Druid' && o.character.spec.name == 'Feral'));
                })
                //var t = 
                $scope.all100 = chunk($scope.level100Member, 3);
                $scope.teamTanks = chunk($scope.allTanks, 3);
                $scope.teamHealers = chunk($scope.allHealers, 3);
                $scope.teamRangedDps = chunk($scope.allRangedDps, 3);
                $scope.teamMeleeDps = chunk($scope.allMeleeDps, 3);
            });
        }

        function chunk(arr, size) {
            var newArr = [];
            for (var i = 0; i < arr.length; i += size) {
                newArr.push(arr.slice(i, i + size));
            }
            //$log.info(newArr);
            return newArr;
        }
        activate();
    });
