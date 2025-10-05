function getLocation(){
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(success, error)
    } else {
        // Put banner at bottom of page.
    }
}

function success() {
    
}