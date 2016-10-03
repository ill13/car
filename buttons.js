function addButtonControls(){

	// create our virtual game controller buttons
    buttonjump = game.add.button(440, 370, 'buttonjump', null, this, 0, 1, 0, 1);  //game, x, y, key, callback, callbackContext, overFrame, outFrame, downFrame, upFrame
    buttonjump.fixedToCamera = true;  //our buttons should stay on the same place
    buttonjump.events.onInputOver.add(function(){bBrake=true;});// was jump
    buttonjump.events.onInputOut.add(function(){bBrake=false;});
    buttonjump.events.onInputDown.add(function(){bBrake=true;});
    buttonjump.events.onInputUp.add(function(){bBrake=false;});

    buttonfire = game.add.button(540, 370, 'buttonfire', null, this, 0, 1, 0, 1);
    buttonfire.fixedToCamera = true;
    buttonfire.events.onInputOver.add(function(){bAccel=true;});//was fire
    buttonfire.events.onInputOut.add(function(){bAccel=false;});
    buttonfire.events.onInputDown.add(function(){bAccel=true;});
    buttonfire.events.onInputUp.add(function(){bAccel=false;});

    buttonleft = game.add.button(0, 400, 'buttonhorizontal', null, this, 0, 1, 0, 1);
    buttonleft.fixedToCamera = true;
    buttonleft.events.onInputOver.add(function(){left=true;});
    buttonleft.events.onInputOut.add(function(){left=false;});
    buttonleft.events.onInputDown.add(function(){left=true;});
    buttonleft.events.onInputUp.add(function(){left=false;});

    // buttonbottomleft = game.add.button(32, 536, 'buttondiagonal', null, this, 6, 4, 6, 4);
    // buttonbottomleft.fixedToCamera = true;
    // buttonbottomleft.events.onInputOver.add(function(){left=true;duck=true;});
    // buttonbottomleft.events.onInputOut.add(function(){left=false;duck=false;});
    // buttonbottomleft.events.onInputDown.add(function(){left=true;duck=true;});
    // buttonbottomleft.events.onInputUp.add(function(){left=false;duck=false;});

    buttonright = game.add.button(160, 400, 'buttonhorizontal', null, this, 0, 1, 0, 1);
    buttonright.fixedToCamera = true;
    buttonright.events.onInputOver.add(function(){right=true;});
    buttonright.events.onInputOut.add(function(){right=false;});
    buttonright.events.onInputDown.add(function(){right=true;});
    buttonright.events.onInputUp.add(function(){right=false;});

    // buttonbottomright = game.add.button(160, 536, 'buttondiagonal', null, this, 7, 5, 7, 5);
    // buttonbottomright.fixedToCamera = true;
    // buttonbottomright.events.onInputOver.add(function(){right=true;duck=true;});
    // buttonbottomright.events.onInputOut.add(function(){right=false;duck=false;});
    // buttonbottomright.events.onInputDown.add(function(){right=true;duck=true;});
    // buttonbottomright.events.onInputUp.add(function(){right=false;duck=false;});

    // buttondown = game.add.button(96, 536, 'buttonvertical', null, this, 0, 1, 0, 1);
    // buttondown.fixedToCamera = true;
    // buttondown.events.onInputOver.add(function(){duck=true;});
    // buttondown.events.onInputOut.add(function(){duck=false;});
    // buttondown.events.onInputDown.add(function(){duck=true;});
    // buttondown.events.onInputUp.add(function(){duck=false;});
}
