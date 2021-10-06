import { Injectable } from "@angular/core";

@Injectable()
export class MapService {

    public zoom;

    constructor() {
    }

    public setZoom(radius){
        if(radius>=100000){
            this.zoom = Math.round(2+(11/(Math.pow(radius,1/8))));
        }
        if(radius<100000 && radius>=20000){
            this.zoom = Math.round(2+(11/(Math.pow(radius,1/20))));
        }
        if(radius<20000 && radius>=10000){
            this.zoom = Math.round(2+(11/(Math.pow(radius,1/30))));
        }
        if(radius<10000 && radius>=5000){
            this.zoom = Math.round(2+(11/(Math.pow(radius,1/50))));
        }
        if(radius<5000 && radius>=2500){
            this.zoom = Math.round(2+(11/(Math.pow(radius,1/150))));
        }
        if(radius<2500 && radius>=1000){
            this.zoom = Math.round(2+(11/(Math.pow(radius,1/250))));
        }
        if(radius<1000 && radius>=500){
            this.zoom = Math.round(2+(12/(Math.pow(radius,1/1000))));
        }
        if(radius<500 && radius>=100){
            this.zoom = Math.round(2+(13/(Math.pow(radius,1/10000))));
        }
        if(radius<100 && radius>=1){
            this.zoom = Math.round(2+(15/(Math.pow(radius,1/10000))));
        }
        return this.zoom;
    }
}
