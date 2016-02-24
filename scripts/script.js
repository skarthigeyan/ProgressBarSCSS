(function () {
    var progressBarApp = new Ractive({
      el: '#container',
      template: '#template',
      data: { 
          /*Karthic:8-Feb-2016: initializing values for the progress bar percentage */
          toUpdateBar:'', //intializing the first progress bar to null by default
          progresslist : [{name:'#progress1',barValue:0},
                          {name:'#progress2',barValue:0},
                          {name:'#progress3',barValue:0}],
          incrementer : [-0.25,-0.10,0.10,0.25],
          getColour:function(i){
            var barList = this.get('progresslist.'+i);
                var colour='blue';
                barList.barValue>1?colour='red':colour='blue';
                return colour;
          }
        }
    });
    progressBarApp.observe('selectedProgressBar',function (newValue,oldValue) {
      progressBarApp.set('toUpdateBar',newValue);
    });
    progressBarApp.on('openPopUp', function () {
      // We can now instantiate our modal
      basicModal = new Modal({
        partials: {
          modalContent: '<button type="button" class="cancelAppClass" on-tap="cancelApp">&times;</button><p>'+
                        'If you press Cancel or close this window, <br>'+
                        'this process cannot be resumed!</p>'+
                        '<a class="modal-button" on-tap="resetToZero">0% complete</a> <br><br>'+
                        '<a class="modal-button" on-tap="cancelApp">Cancel</a>'
        }
      });
      basicModal.on( 'cancelApp', function () {
        this.teardown();
        //progressBarApp.teardown();
        listener.cancel();
      });
      basicModal.on( 'resetToZero', function () {
        progressBarApp.reset({ 
          toUpdateBar:'', 
          progresslist : [{name:'#progress1',barValue:0},
                          {name:'#progress2',barValue:0},
                          {name:'#progress3',barValue:0}],
          incrementer : [-0.25,-0.10,0.10,0.25],
          getColour:function(i){
            var barList = this.get('progresslist.'+i);
                var colour='blue';
                barList.barValue>1?colour='red':colour='blue';
                return colour;
          }
        });
        progressBarApp.set('toUpdateBar',document.getElementById("progressid").value);
        this.teardown();
      });
    });
    var listener = progressBarApp.on( 'updateProgressBar', function (event,incrementvalue,toUpdateBar) {
      var pList =  progressBarApp.get('progresslist');
      //setTimeout(function(){
      for (var i in pList){
          var curValue=progressBarApp.get('progresslist.'+i+'.barValue');
          var curBar=progressBarApp.get('progresslist.'+i+'.name');
          if (curBar===toUpdateBar){            
              progressBarApp.set('progresslist.'+i+'.barValue',curValue+incrementvalue<0?0:curValue+incrementvalue);            
          }          
      } 
      //}, 10);
    });
    var animating = []
    progressBarApp.observe('progresslist.*.barValue', function(newValue, oldValue, keypath, index) {
    // the animation update will re-enter the observer, so bail
    // if we are animating...
    if ( animating[index] ) { return; }
    animating[index] = true;
    progressBarApp.set(keypath, oldValue);   
    progressBarApp.animate(keypath, newValue).then(function(){
        animating[index] = false;
    });

});

Modal = Ractive.extend({
  // by default, the modal should sit atop the <body>...
  el: document.body,
  // ...but it should append to it rather than overwriting its contents
  append: true,
  // all Modal instances will share a template (though you can override it
  // on a per-instance basis, if you really want to)
  template: "#modalTemplate",
  // the onrender function will be called as soon as the instance has
  // finished rendering
  onrender: function () {
    var self = this, resizeHandler;
    // store references to the background, and to the modal itself
    // we'll assume we're in a modern browser and use querySelector
    this.outer = this.find( '.modal-outer' );
    this.modal = this.find( '.modal' );
    // if the user taps on the background, close the modal
    this.on( 'close', function ( event ) {
      if ( !this.modal.contains( event.original.target ) ) {
        this.teardown();
      }
    });
    // clean up after ourselves later
    this.on( 'teardown', function () {
      window.removeEventListener( 'resize', resizeHandler );
    }, false );
  },
});

   
}());