var module = angular.module("lvl.directives.dragdrop", ['lvl.services']);

module.directive('lvlDraggable', ['$rootScope', 'uuid', function($rootScope, uuid) {
    return {
        restrict: 'A',
        link: function(scope, el, attrs, controller) {
            angular.element(el).attr("draggable", "true");

            var id = angular.element(el).attr("id");
            if (!id) {
                id = uuid.new()
                angular.element(el).attr("id", id);
            }

            el.bind("dragstart", function(e) {
                e.originalEvent.dataTransfer.setData('text', id);

                angular.element(e.target).addClass('lvl-over');
                var clickedAt = {
                    left : e.originalEvent.offsetX,
                    top : e.originalEvent.offsetY
                };
                e.originalEvent.dataTransfer.setData('clickedLocation', JSON.stringify(clickedAt));
                $rootScope.$emit("LVL-DRAG-START");
            });

            el.bind("dragend", function(e) {
                angular.element(e.target).removeClass('lvl-over');
                $rootScope.$emit("LVL-DRAG-END");
            });



            el.bind('resize', function(e) {
                alert("in Here");
            });
        }
    }
}]);


module.directive('lvlDropTarget', ['$rootScope', 'uuid', function($rootScope, uuid) {
    return {
        restrict: 'A',
        scope: {
            onDrop: '&'
        },
        link: function(scope, el, attrs, controller) {
            var id = angular.element(el).attr("id");
            if (!id) {
                id = uuid.new()
                angular.element(el).attr("id", id);
            }

            el.bind("dragover", function(e) {
                if (e.preventDefault) {
                    e.preventDefault(); // Necessary. Allows us to drop.
                }

                e.originalEvent.dataTransfer.dropEffect = 'move';  // See the section on the DataTransfer object.
                return false;
            });

            el.bind("dragenter", function(e) {
                // this / e.target is the current hover target.
                angular.element(e.target).addClass('lvl-over');
            });

            el.bind("dragleave", function(e) {
                angular.element(e.target).removeClass('lvl-over');  // this / e.target is previous target element.
            });

            el.bind("drop", function(e) {
                if (e.preventDefault) {
                    e.preventDefault(); // Necessary. Allows us to drop.
                }

                if (e.stopPropagation) {
                    e.stopPropagation(); // Necessary. Allows us to drop.
                }
                var data = e.originalEvent.dataTransfer.getData("text");
                var clickedLocation = JSON.parse(e.originalEvent.dataTransfer.getData("clickedLocation"));

                var dest = document.getElementById(id);
                var src = document.getElementById(data);
                var location = {
                    left : e.originalEvent.offsetX - clickedLocation.left,
                    top : e.originalEvent.offsetY - clickedLocation.top
                };

                scope.onDrop({dragEl: src, dropEl: dest, locationEl : location});
            });

            $rootScope.$on("LVL-DRAG-START", function() {
                var el = document.getElementById(id);
                angular.element(el).addClass("lvl-target");
            });

            $rootScope.$on("LVL-DRAG-END", function() {
                var el = document.getElementById(id);
                angular.element(el).removeClass("lvl-target");
                angular.element(el).removeClass("lvl-over");
            });
        }
    }
}]);