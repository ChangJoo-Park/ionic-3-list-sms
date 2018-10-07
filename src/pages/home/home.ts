import { Component } from '@angular/core';
import { NavController, Platform } from 'ionic-angular';

declare var window: any;


// See : https://github.com/floatinghotpot/cordova-plugin-sms
// See : https://pointdeveloper.com/read-sms-list-with-ionic-2/
// See : https://developer.android.com/reference/android/Manifest.permission
// See : https://forum.ionicframework.com/t/grant-camera-permission/113751/4
// See : https://www.npmjs.com/package/cordova-plugin-permission

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  public smses:any;

  constructor(
    public navCtrl: NavController,
    private platform: Platform
    ) {
      platform.ready().then(result => {
        const Permission = window.plugins.Permission

        // verify grant for a permission
        const permission = 'android.permission.READ_SMS'
        Permission.has(permission, function(results) {
            if (results[permission]) {
                // permission is granted
                window.alert('has permission');
            } else {
                window.alert('has not permission');
                Permission.request(permission, function(results) {
                  if (results[permission]) {
                      // permission is granted
                      window.alert('Grant permission')
                  } else {
                      window.alert('Not Grant permission')
                  }
                }, alert)
            }
        }, alert)

      })
      .catch(error => {
        window.alert('platform not ready')
      })
  }

  getSMS(){
    if (this.platform.is('android')) {
      const filter = {
        box : 'inbox', // 'inbox' (default), 'sent', 'draft', 'outbox', 'failed', 'queued', and '' for all
        // following 4 filters should NOT be used together, they are OR relationship
        // read : 0, // 0 for unread SMS, 1 for SMS already read
        // _id : 1234, // specify the msg id
        // address : '+9876543210', // sender's phone number
        body : '', // content to match
        // following 2 filters can be used to list page up/down
        indexFrom : 0, // start from index 0
        maxCount : 100, // count of SMS to return each time
      };

      if(window.SMS) window.SMS.listSMS(filter,data=>{
        setTimeout(()=>{
          window.alert('success')
            console.log(data);
            this.smses=JSON.stringify(data);
        },0)
      },error=>{
        window.alert(JSON.stringify(error))
        console.log(error);
      });
    }
  }
}
