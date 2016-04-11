'use strict';

angular.module('webGamerApp')
    .controller('MainCtrl', function($scope, $http, $log, socket) {
        $scope.awesomeThings = [];
        $scope.d3Data = {};
        $scope.selectedToon = {};
        $scope.toonName = '';
        $scope.currentReset = {
            start: new Date(),
            end: new Date()
        };

        $scope.guildData = [];


        var today = new Date();
        if (today.getDay() < 3) {
            //We are still in the current lockout
            //get the date of day 3 of the week.
            var result = new Date();
            $scope.currentReset.end = new Date(result.setDate(result.getDate() + (3 - today.getDay())));
            var priorDate = new Date().setDate($scope.currentReset.end.getDate() - 7);
            $scope.currentReset.start = new Date(priorDate);
            $log.info($scope.currentReset);
        }


        $http.get('/api/things').success(function(awesomeThings) {
            $scope.awesomeThings = awesomeThings;
            socket.syncUpdates('thing', $scope.awesomeThings);
        });
        $scope.classes = [{ "id": 3, "mask": 4, "powerType": "focus", "name": "Hunter" }, { "id": 4, "mask": 8, "powerType": "energy", "name": "Rogue" }, { "id": 1, "mask": 1, "powerType": "rage", "name": "Warrior" }, { "id": 2, "mask": 2, "powerType": "mana", "name": "Paladin" }, { "id": 7, "mask": 64, "powerType": "mana", "name": "Shaman" }, { "id": 8, "mask": 128, "powerType": "mana", "name": "Mage" }, { "id": 5, "mask": 16, "powerType": "mana", "name": "Priest" }, { "id": 6, "mask": 32, "powerType": "runic-power", "name": "Death Knight" }, { "id": 11, "mask": 1024, "powerType": "mana", "name": "Druid" }, { "id": 9, "mask": 256, "powerType": "mana", "name": "Warlock" }, { "id": 10, "mask": 512, "powerType": "energy", "name": "Monk" }];
        //  $http.get('/api/battlenet/wow/classes').success(function (val) {
        //       $log.info(val.classes);
        //       //$scope.realms = val.realms;
        //      $scope.classes = val.classes;
        //     });
        $http.get('/api/battlenet').success(function(val) {
            //$log.info(val);
            //$scope.realms = val.realms;
            $scope.chunkedData = chunk(val.realms, 4);
        });
        $http.get('/api/battlenet/wow/Silvermoon/' + 'Forward únto Dawn').success(function(val) {
            $scope.guildData = val;
            var level100Member = _.filter(val.members, function(o) {
                return o.character.level == 100 && o.rank < 6;
            })
            level100Member = _.sortBy(level100Member, ['rank']);
            var tanks = _.filter(level100Member, function(o) {
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
            var healers = _.filter(level100Member, function(o) {
                if (o.character.spec == undefined) {
                    return false;
                }
                return o.character.spec.role == 'HEALING';
            })
            var dps = _.filter(level100Member, function(o) {
                if (o.character.spec == undefined) {
                    return false;
                }
                return o.character.spec.role == 'DPS';
            })
            //var t = 
            $scope.all100 = chunk(level100Member, 4);
            $scope.guildTanks = chunk(tanks, 4);
            $scope.healers = chunk(healers, 4);
            $scope.dps = chunk(dps, 4);
        });



        function chunk(arr, size) {
            var newArr = [];
            for (var i = 0; i < arr.length; i += size) {
                newArr.push(arr.slice(i, i + size));
            }
            //$log.info(newArr);
            return newArr;
        }

        $scope.showCharacter = function(name) {
            $log.info(name);
            $http.get('/api/battlenet/wow/char/silvermoon/' + name).success(function(val) {
               // $log.info(val);
                $scope.selectedToon = val;
                $scope.selectedFeed = _.filter(val.feed, function(o) {
                    // $log.info(o);

                    // var d2 = new Date(d1);
                    // var same = d1.getTime() === d2.getTime();
                    // var notSame = d1.getTime() !== d2.getTime();
                     return (o.type == "BOSSKILL") &&
                         (o.timestamp <= $scope.currentReset.end && o.timestamp >= $scope.currentReset.start) &&
                        o.achievement.title.indexOf("(Heroic Hellfire Citadel)") > -1;
                });
            });
        };

        $scope.addThing = function() {
            if ($scope.newThing === '') {
                return;
            }
            $http.post('/api/things', { name: $scope.newThing });
            $scope.newThing = '';
        };

        $scope.deleteThing = function(thing) {
            $http.delete('/api/things/' + thing._id);
        };

        $scope.$on('$destroy', function() {
            socket.unsyncUpdates('thing');
        });
    });
