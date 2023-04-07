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
  newleft = 0;
  state: any = [];
  mods = 0;
  dummyImages = [
    'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQpngGRjYX1ca7qAADU3K6eGLj7ShQE3L2otdzfryl_Y9Ht2QRoQKYQbsXd36XIxMbYOw0&usqp=CAU',
    'https://static.javatpoint.com/csspages/images/css-tutorial.png',
    'https://static.javatpoint.com/images/javascript/javascript_logo.png',
  ];

  ngOnInit() {
    this.canvas = new fabric.Canvas('canvas', {
      width: 800,
      height: 600,
    });
    this.canvas.counter = 0;
    this.canvas.selection = false;
    this.newleft = 0;
    this.state = [];
    this.mods = 0;
    const updateModificationsRef = this.updateModifications;
    const ref = this;

    this.canvas.on(
      'object:modified',
      () => {
        updateModificationsRef.call(ref, true);
      },
      'object:added',
      () => {
        updateModificationsRef.call(ref, true);
      }
    );
  }

  addRect() {
    const rect = new fabric.Rect({
      top: this.canvas.height / 2,
      left: this.canvas.width / 2,
      width: 100,
      height: 100,
      fill: 'red',
      originX: 'center',
      originY: 'center',
    });

    this.canvas.add(rect);
    this.canvas.renderAll();

    this.updateModifications(true);
    this.canvas.counter++;
    this.newleft += 100;
  }

  addCircle() {
    const circle = new fabric.Circle({
      top: this.canvas.height / 2,
      left: this.canvas.width / 2,
      radius: 50,
      fill: 'red',
      originX: 'center',
      originY: 'center',
    });

    this.canvas.add(circle);
    this.canvas.renderAll();

    this.updateModifications(true);
    this.canvas.counter++;
    this.newleft += 100;
  }

  addText() {
    const textbox = new fabric.Textbox('Lorum ipsum dolor sit amet', {
      top: this.canvas.height / 2,
      left: this.canvas.width / 2,
      width: 150,
      fontSize: 20,
      originX: 'center',
      originY: 'center',
    });
    this.canvas.add(textbox);

    this.updateModifications(true);
    this.canvas.counter++;
    this.newleft += 100;
  }

  addImage(url: string) {
    const canvasRef = this.canvas;
    const ref = this;

    fabric.Image.fromURL(url || this.imageUrl, function (myImg) {
      //i create an extra var for to change some image properties
      const img1 = myImg.set({
        top: ref.canvas.height / 2,
        left: ref.canvas.width / 2,
        // width: 400,
        // height: 250,
        originX: 'center',
        originY: 'center',
      });
      canvasRef.add(img1);

      ref.updateModifications(true);
      ref.canvas.counter++;
      ref.newleft += 100;
    });
  }

  uploadImage(event: any) {
    if (event?.target?.files[0]) {
      const reader = new FileReader();
      reader.readAsDataURL(event?.target?.files[0]);
      reader.onload = (e) => {
        this.imageUrl = e.target?.result;

        this.addImage('');
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

    this.updateModifications(true);
    this.canvas.counter++;
    this.newleft += 100;
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

  updateModifications(savehistory: boolean) {
    if (savehistory === true) {
      const myjson = JSON.stringify(this.canvas);
      this.state.push(myjson);
    }
  }

  undo() {
    if (this.mods < this.state.length) {
      this.canvas.clear().renderAll();
      this.canvas.loadFromJSON(
        this.state[this.state.length - 1 - this.mods - 1]
      );
      this.canvas.renderAll();
      //console.log("geladen " + (state.length-1-mods-1));
      //console.log("state " + state.length);
      this.mods += 1;
      //console.log("mods " + mods);
    }
  }

  redo() {
    if (this.mods > 0) {
      this.canvas.clear().renderAll();
      this.canvas.loadFromJSON(
        this.state[this.state.length - 1 - this.mods + 1]
      );
      this.canvas.renderAll();
      //console.log("geladen " + (state.length-1-mods+1));
      this.mods -= 1;
      //console.log("state " + state.length);
      //console.log("mods " + mods);
    }
  }

  clearcan() {
    this.canvas.clear().renderAll();
    this.newleft = 0;
  }

  addImages() {
    const json = JSON.parse(localStorage.getItem('canvas') || '');
    if (json) {
      const arr = json.objects;
      const canvasRef = this.canvas;

      let i = 0;

      for (const obj of arr) {
        if (obj.type === 'image') {
          obj.src = this.dummyImages[i];
          i++;
        }
      }

      const ref = this;
      const promises = [];

      while (i < this.dummyImages.length) {
        const promise = new Promise((resolve) => {
          fabric.Image.fromURL(this.dummyImages[i], function (myImg) {
            //i create an extra var for to change some image properties
            const img1 = myImg.set({
              top: ref.canvas.height / 2,
              left: ref.canvas.width / 2,
              // width: 400,
              // height: 250,
              originX: 'center',
              originY: 'center',
            });
            resolve(JSON.parse(JSON.stringify(img1)));
          });
        });
        promises.push(promise);
        i++;
      }

      Promise.all(promises).then((data) => {
        json.objects = [...json.objects, ...data];
        canvasRef.loadFromJSON(
          json,
          function () {
            canvasRef.renderAll();
          },
          function (o: any, object: any) {
            // console.log(o, object);
          }
        );
      });
    }
  }
}
