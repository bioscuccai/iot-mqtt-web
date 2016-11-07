app.controller("MessagesCtrl", function($scope, $mdDialog, $mdToast, MessageFactory, devices){
  $scope.devices=devices;
  $scope.newMessage={
    targetDevice: null,
    targetDeviceType: null,
    message: ""
  };

  $scope.deviceTypes=_(devices).map("type").uniq().value();

  $scope.sendMessage=function(){
    MessageFactory.newMessage({
      targetDevice: $scope.newMessage.targetDevice,
      targetDeviceType: $scope.newMessage.targetDeviceType,
      message: $scope.newMessage.message
    })
    .then(function(res){
      $mdToast.showSimple("Message sent");
    })
    .catch(function(err){
      console.log(err);
      $mdToast.showSimple("Error");
    });
  };
});
