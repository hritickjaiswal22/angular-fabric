import { Component } from '@angular/core';
import { fabric } from 'fabric';

@Component({
  selector: 'app-canvas',
  templateUrl: './canvas.component.html',
  styleUrls: ['./canvas.component.css'],
})
export class CanvasComponent {
  canvas: any = null;
  imageUrl: any = 'assets/demo.jpg';

  ngOnInit() {
    this.canvas = new fabric.Canvas('canvas', {
      width: 800,
      height: 600,
    });
  }

  addRect() {
    const rect = new fabric.Rect({
      width: 100,
      height: 100,
      fill: 'red',
      originX: 'center',
      originY: 'center',
    });

    this.canvas.add(rect);
    this.canvas.renderAll();
  }

  addCircle() {
    const circle = new fabric.Circle({
      radius: 50,
      fill: 'red',
      originX: 'center',
      originY: 'center',
    });

    this.canvas.add(circle);
    this.canvas.renderAll();
  }

  addText() {
    const textbox = new fabric.Textbox('Lorum ipsum dolor sit amet', {
      left: 50,
      top: 50,
      width: 150,
      fontSize: 20,
      originX: 'center',
      originY: 'center',
    });
    this.canvas.add(textbox);
  }

  addImage() {
    const canvasRef = this.canvas;

    fabric.Image.fromURL(this.imageUrl, function (myImg) {
      //i create an extra var for to change some image properties
      const img1 = myImg.set({
        left: 0,
        top: 0,
        // width: 400,
        // height: 250,
        originX: 'center',
        originY: 'center',
      });
      canvasRef.add(img1);
    });
  }

  uploadImage(event: any) {
    if (event?.target?.files[0]) {
      const reader = new FileReader();
      reader.readAsDataURL(event?.target?.files[0]);
      reader.onload = (e) => {
        this.imageUrl = e.target?.result;

        this.addImage();
      };
    }
  }

  toGreen() {
    this.canvas.getActiveObject()?.set('fill', 'green');
    this.canvas.renderAll();
  }

  toBlue() {
    this.canvas.getActiveObject()?.set('fill', 'blue');
    this.canvas.renderAll();
  }

  bold() {
    const isBold = this.canvas.getActiveObject()?.fontWeight === 'bold';

    this.canvas.getActiveObject()?.set('fontWeight', isBold ? '' : 'bold');
    this.canvas.renderAll();
  }

  italicize() {
    const isItalic = this.canvas.getActiveObject()?.fontStyle === 'italic';
    this.canvas.getActiveObject()?.set('fontStyle', isItalic ? '' : 'italic');
    this.canvas.renderAll();
  }

  underline() {
    const truth = this.canvas.getActiveObject()?.underline;

    this.canvas.getActiveObject()?.set('underline', !truth);
    this.canvas.renderAll();
  }

  rotateObject(angleOffset: number) {
    const obj = this.canvas.getActiveObject();

    if (!obj) return;

    let angle = Number(obj.get('angle')) + angleOffset;

    angle = angle > 360 ? 90 : angle < 0 ? 270 : angle;

    obj.set('angle', angle).setCoords();

    this.canvas.renderAll();
  }

  rotateLeft() {
    this.rotateObject(-90);
  }

  rotateRight() {
    this.rotateObject(90);
  }

  remove() {
    this.canvas.remove(this.canvas.getActiveObject());
  }

  undo() {
    if (this.canvas._objects.length) this.canvas._objects.pop();
    this.canvas.renderAll();
  }

  export() {
    const json = this.canvas.toJSON(['wizard', 'hobbit']);

    localStorage.setItem('canvas', JSON.stringify(json));

    console.log(json);
  }

  loadFromLocalStorage() {
    const canvasRef = this.canvas;
    const json = JSON.parse(localStorage.getItem('canvas') || '');

    canvasRef.loadFromJSON(
      json,
      function () {
        canvasRef.renderAll();
      },
      function (o: any, object: any) {
        console.log(o, object);
      }
    );
  }
}
