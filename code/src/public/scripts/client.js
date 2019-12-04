var app = angular.module('facemash',[]);

app.controller('panelController',['$scope','$http',function panelController($scope,$http){

    $scope.image = {};
    $scope.image.left = {};
    $scope.image.right = {};

    $scope.set = new Set();
    $scope.combinations = new Set();

    $scope.ranking = {};

    $http.get('/init').then(
        (res) => {
            $scope.image.left = res.data.left;
            $scope.image.right = res.data.right;

            let z = [JSON.stringify(res.data.left),JSON.stringify(res.data.right)];
            $scope.set.add( z.sort().join() );
        },
        (err) => {
            console.log(err);
        }
    );

    $scope.hit = function(e){
        let selected = $scope.image[e.target.id]
        let url = "/hit?l=" + $scope.image.left.name + "&r=" + $scope.image.right.name + "&f=" + selected.name;
        
        $http.get(url).then(
            (res) => {
                $scope.image[e.target.dataset.opposite] = res.data.image;
            },
            (err) => {console.log(err)}
        )

    }   
    
    $http.get('/ranking').then(
        (res) => {
            $scope.ranking = res.data.rank[0];
            console.log(res.data.rank);
        },
        (err) => {console.log(err)}

    );

}]);


app.controller('rank',['$scope','$http',function($scope,$http){

    $scope.ranking = {};
    $scope.lable = "ranking";

    $http.get('/ranking').then(
        (res) => {
            $scope.ranking = res.data.rank;
        },
        (err) => { console.log(err) }
    )

    $scope.toggle = (e) => {
        
        if($scope.lable == "ranking"){

            $http.get('/ranking').then(
                (res) => {
                    $scope.ranking = res.data.rank;
                },
                (err) => { console.log(err) }
            )

            $scope.lable = "back";
            document.getElementById('rank-panel').style.visibility = "visible";
        }
        else{
            $scope.lable = "ranking";
            document.getElementById('rank-panel').style.visibility = "hidden";
        }

    }

}]);