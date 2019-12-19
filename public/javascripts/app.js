var app = angular.module('angularjsNodejsTutorial', []);



/* Controller for the sign up page*/
app.controller('registerController', function($scope, $http) {

  $scope.register() = function(){
    var userdata = {
      username: $scope.username,
      password: $scope.password
    }

    $http({
      url:'/register',
      method:'POST',
      data:$.param(userdata)
    }).then(res =>{
      alert(res.data.message)
    })

  }

});

/* Controller for the log in page*/

app.controller('loginController', function($scope, $http) {
/*
  $http({
    url:'/login/'+$scope.username,//undefined
    method:'GET'
  }).then(res =>{
    console.log("FRONTEND username:", res.data)
  },err =>{
    console.log("GET USERNAME ERROR:",err)
  })
*/

  $scope.login() = function(){
    var userdata = {
      username: $scope.username,
      password: $scope.password
    }

    $http({
      url:'/login',
      method:'GET',
      data:$.param(userdata),
      headers: {'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'}
    }).then(res =>{
      alert(res.data.message)
    })

  }



});

app.controller('profileController', function($scope,$http) {
  $scope.currentUserId = 1
  console.log("this is the controller of profile")
  $http({
    url: '/profile/' + $scope.currentUserId,
    method: 'GET'
  }).then(res => {
    console.log("getting profile message from database!---")
    console.log(res)

    $scope.user_name = res.data[1]
    $scope.age = res.data[7]
    $scope.gender = res.data[5]
    $scope.height = res.data[6]
    $scope.weight = res.data[3]
    $scope.fav_fd = res.data[9]
    $scope.fav_ex = res.data[10]
    $scope.aim = res.data[4]
    $scope.bmr = res.data[2]

})});
app.controller('editController', function($scope,$http) {

  $scope.genders = ["male","female"];
  $scope.aims = ["fat","strong","thin"];

  $scope.submitUpdate = function () {
    console.log("修改的步骤正在开始！")

    let postdata = {
        username: $scope.username,
        age: $scope.age,
        gender: $scope.selectedgender,
        height: $scope.height,
        weight: $scope.weight,
        aim: $scope.selectedaim,
        fav_ex:$scope.fav_ex,
        fav_fd:$scope.fav_fd
    }
    var bmr = 0;
    if(postdata.gender == 'female'){
      bmr = 9.6*postdata.weight+ 1.8*postdata.height - 4.7*postdata.age + 655
    }else{
      bmr = 13.7*postdata.weight+ 5.0*postdata.height - 6.8*postdata.age + 66
    }
    postdata = {
      username: $scope.username,
      age: $scope.age,
      gender: $scope.selectedgender,
      height: $scope.height,
      weight: $scope.weight,
      aim: $scope.selectedaim,
      bmr: bmr,
      fav_ex:$scope.fav_ex,
      fav_fd:$scope.fav_fd
  }
    console.log(" controller - username "+postdata.username)
    console.log(" controller -age"+postdata.age)
    console.log(" controller -gender "+postdata.gender)
    console.log(" controller -height"+postdata.height)
    console.log(" controller -weight"+postdata.weight)
    console.log(" controller -fav_ex"+postdata.fav_ex)
    console.log(" controller -fav_fd"+postdata.fav_fd)
    
    $http({
      method:'PUT',
      url: '/edit',
      data: $.param(postdata),
      headers: {'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'}
    }).then(res => {
    if(res){
            console.log("修改成功!")
            res.json("送成了呀")
  }
    else{console.log("edit failed!")}})
  }})

app.controller('exerciseSearchController', function($scope, $http) {

  $scope.submitExercise = function() {
    $http({
      url:'/exerciseSearch/' + $scope.exerciseName,
      method: 'GET'
    }).then(res => {
      console.log("search result: ", res.data);
      $scope.exerciseResults=res.data;

    }, err => {
      console.log("search ERROR: ", err);
    });
  }

  $scope.submitE = function(x) {
    $http({
      url:'/exerciseSearch1/' + encodeURIComponent(x[0]),
      method: 'GET'
    }).then(res => {
      console.log("search result: ", res.data);
      $scope.calories=res.data;

    }, err => {
      console.log("search ERROR: ", err);
    });
  }
});

app.controller('foodSearchController', function($scope, $http) {

  $scope.submitFood = function() {
    $http({
      url:'/foodSearch/' + $scope.foodName,
      method: 'GET'
    }).then(res => {
      console.log("search result: ", res.data);
      $scope.foodResults=res.data;

    }, err => {
      console.log("search ERROR: ", err);
    });
  }

  $scope.submitF = function(x) {
    $http({
      url:'/foodSearch1/' + x[0],
      method: 'GET'
    }).then(res => {
      console.log("search result: ", res.data);
      $scope.nutrition=res.data;

    }, err => {
      console.log("search ERROR: ", err);
    });
  }
});


app.controller('caloriesSearchController', function($scope, $http) {
  $scope.submitNutrition = function() {
    console.log($scope);
    $http({
      url:'/caloriesSearch/' + $scope.nutritionName,
      method: 'GET'
    }).then(res => {
      console.log("search result: ", res.data);
      $scope.nutritionResults=res.data;

    }, err => {
      console.log("search ERROR: ", err);
    });
  }
});

app.controller('proteinSearchController', function($scope, $http) {
  $scope.submitProtein = function() {
    console.log($scope);
    $http({
      url:'/proteinSearch/' + $scope.proteinAmount,
      method: 'GET'
    }).then(res => {
      console.log("search result: ", res.data);
      $scope.proteinResults=res.data;

    }, err => {
      console.log("search ERROR: ", err);
    });
  }
});

// Controller for the history page
app.controller('historyController', function($scope, $http) {  
  $scope.submitDate = function() {
    $http({
      url:'/history/' + $scope.selectedDate +'/' + $scope.selectedDate2,
      method: 'GET'
    }).then(res => {
      console.log("search result: ", res.data);
      $scope.records=res.data;
    }, err => {
      console.log("search ERROR: ", err);
    });
    $http({
      url:'/history1/' + $scope.selectedDate +'/' + $scope.selectedDate2,
      method: 'GET'
    }).then(res => {
      console.log("search result: ", res.data);
      $scope.records1=res.data;
    }, err => {
      console.log("search ERROR: ", err);
    });
  }

})
// Controller for the recommendations 
app.controller('recommendController', function($scope, $http) {  
  $http({
    url:'/recdata',
    method: 'GET'
  }).then(res => {
    console.log("search result: ", res.data);
    $scope.recs = res.data;
  }, err => {
    console.log("search ERROR: ", err);
  });

})


app.controller('trackController', function($scope,$http) {
  
  // method 传值进入 exercise track
  $scope.submitExerciseTrack = function () {
    console.log("submitExerciseTrack is running!")
    let postdata = {
        exercise_name: $scope.exercise_name[0],
        workout_time: $scope.workout_time,
    }

    console.log("input 的 exercise_name 是 "+postdata.exercise_name)
        // typeof ($scope.exercise_name))
    console.log("input 的 workout_time 是 "+postdata.workout_time)

    $http({
      method:'POST',
      url: '/exercise_track',
      data: $.param(postdata),
      headers: {'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'}
    }).then(res => {
    if(res){
            console.log("送成功了兄弟！")
  }
    else{console.log("错了啊兄弟！")}})
  }

  $scope.submitTrackE = function() {
    $http({
      url:'/exercise_track1/' + $scope.exerciseTrack,
      method: 'GET'
    }).then(res => {
      console.log("search result: ", res.data);
      $scope.eTrackResults=res.data;

    }, err => {
      console.log("search ERROR: ", err);
    });
  }

  $scope.submitTrackF = function() {
    $http({
      url:'/food_track/' + $scope.foodTrack,
      method: 'GET'
    }).then(res => {
      console.log("search result: ", res.data);
      $scope.fTrackResults=res.data;

    }, err => {
      console.log("search ERROR: ", err);
    });
  }

  // method 传值到 food track
  $scope.submitFoodTrack = function () {
    console.log("submitFoodTrack is running!")

    let postdata = {
        food_name: $scope.food_name[1],
        food_amount: $scope.food_amount,
    }

    console.log("input food_name "+postdata.food_name)
    console.log("input food_amount "+postdata.food_amount)

    $http({
      method:'POST',
      url: '/food_track',
      data: $.param(postdata),
      headers: {'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'}
    }).then(res => {
    if(res){
            console.log("Success!")
  }
    else{console.log("Failed!")}})}

  $scope.getAdv = function() {
    $http({
      url:'/advise',
      method: 'GET'
    }).then(res => {
      console.log("search result: ", res.data);
      $scope.advres=res.data;
    }, err => {
      console.log("search ERROR: ", err);
    });
  }
})

