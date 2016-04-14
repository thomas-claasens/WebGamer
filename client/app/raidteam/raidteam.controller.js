'use strict';

angular.module('webGamerApp')
    .controller('RaidteamCtrl', function($scope, $log, $http) {
        $scope.classes = [{ "id": 3, "mask": 4, "powerType": "focus", "name": "Hunter" }, { "id": 4, "mask": 8, "powerType": "energy", "name": "Rogue" }, { "id": 1, "mask": 1, "powerType": "rage", "name": "Warrior" }, { "id": 2, "mask": 2, "powerType": "mana", "name": "Paladin" }, { "id": 7, "mask": 64, "powerType": "mana", "name": "Shaman" }, { "id": 8, "mask": 128, "powerType": "mana", "name": "Mage" }, { "id": 5, "mask": 16, "powerType": "mana", "name": "Priest" }, { "id": 6, "mask": 32, "powerType": "runic-power", "name": "Death Knight" }, { "id": 11, "mask": 1024, "powerType": "mana", "name": "Druid" }, { "id": 9, "mask": 256, "powerType": "mana", "name": "Warlock" }, { "id": 10, "mask": 512, "powerType": "energy", "name": "Monk" }];

        $scope.sortedClasses = _.sortBy($scope.classes, ['name']);

        //Loadup initial data for the load of the page.      
        function activate() {
            $log.info('Load Called');
            getGuildMembers();
            $log.info('Loaded Guild Members');

        };
        $scope.addCharacter = function(data) {
            //This will add the member to the db as member of the raid group.
            //$log.info('Here');
            //$log.info(data);
        };

        $scope.removeCharacter = function(data) {
        //this will remove the member from the raid group.    
        }        
        function getGuildMembers() {
            $http.get('/api/battlenet/wow/Silvermoon/' + 'Forward únto Dawn').success(function(val) {
                $scope.guildData = val;
//we want to show ALL members that are level 100
                $scope.level100Member = _.filter(val.members, function(o) {
                    return o.character.level == 100;// && o.rank <= 6;
                })
                $scope.level100Member = _.sortBy($scope.level100Member, ['level','class', 'rank']);
                $scope.allTanks = _.filter($scope.level100Member, function(o) {
                    // $log.info(o.character.spec);
                    if (o.character.spec == undefined) {
                        return false;
                    }
                    //Update the class name from the ID
                    var toonClass = _.find($scope.classes, function(fdn) {
                        return fdn.id == o.character.class;
                    });
                    //o.character.name = 'BOB';
                    o.character.className = toonClass.name;
                    return o.character.spec.role == 'TANK';
                })
                $scope.allHealers = _.filter($scope.level100Member, function(o) {
                    if (o.character.spec == undefined) {
                        return false;
                    }
                    return o.character.spec.role == 'HEALING';
                })
                $scope.allRangedDps = _.filter($scope.level100Member, function(o) {
                    if (o.character.spec == undefined) {
                        return false;
                    }
                    return o.character.spec.role == 'DPS' &&
                        (o.character.className == 'Hunter' ||
                        o.character.className == 'Mage' ||
                        o.character.className == 'Warlock' ||
                            (o.character.className == 'Shaman' && o.character.spec.name == 'Elemental') ||
                            (o.character.className == 'Druid' && o.character.spec.name == 'Balance'));
                })
                $scope.allMeleeDps = _.filter($scope.level100Member, function(o) {
                    if (o.character.spec == undefined) {
                        return false;
                    }
                    return o.character.spec.role == 'DPS' &&
                        (o.character.className == 'Rogue' ||
                        o.character.className == 'Warrior' ||
                        o.character.className == 'Paladin' ||
                        o.character.className == 'Death Knight' ||                        
                            (o.character.className == 'Shaman' && o.character.spec.name == 'Enhancement') ||
                            (o.character.className == 'Druid' && o.character.spec.name == 'Feral'));
                })
                //var t = 
                $scope.all100 = chunk($scope.level100Member, 4);
                $scope.teamTanks = chunk($scope.allTanks, 4);
                $scope.teamHealers = chunk($scope.allHealers, 4);
                $scope.teamRangedDps = chunk($scope.allRangedDps, 4);
                $scope.teamMeleeDps = chunk($scope.allMeleeDps, 4);
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
