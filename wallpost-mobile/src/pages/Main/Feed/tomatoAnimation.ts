import p5 from 'p5';

interface TomatoAnimationOptions {
  /** Element DOM, nad którym ma wycentrować się animacja (np. kontener posta) */
  targetElement: HTMLElement;
  /** Funkcja wywoływana automatycznie po zakończeniu całej animacji */
  onComplete: () => void;
}

export function playTomatoAnimation({ targetElement, onComplete }: TomatoAnimationOptions): () => void {
  // 1. Dynamicznie tworzymy kontener dla płótna p5.js
  const container = document.createElement('div');
  container.style.position = 'absolute';
  container.style.top = '50%';
  container.style.left = '50%';
  container.style.transform = 'translate(-50%, -50%)';
  container.style.zIndex = '9999';
  container.style.pointerEvents = 'none'; // Kliknięcia przechodzą przez animację

  // Upewniamy się, że element nadrzędny ma pozycjonowanie relatywne
  const originalPosition = targetElement.style.position;
  if (!originalPosition || originalPosition === 'static') {
    targetElement.style.position = 'relative';
  }

  targetElement.appendChild(container);

  // 2. Definicja szkicu p5.js w trybie instancji
  const sketch = (p: p5) => {
    let tomato: any;
    let tomato_pg: p5.Graphics;

    let frame_ID = 0;
    const max_tomato_frames = 30;
    const max_splatter_frames = 30;

    let x_rot_speed = 8;
    let y_rot_speed = 2;
    let z_rot_speed = 16;

    class Tomato {
      size: number;
      rotation_x: number;
      rotation_y: number;
      rotation_z: number;
      red_base: p5.Color | null;

      constructor(size: number, rotation_x: number, rotation_y: number, rotation_z: number) {
        this.size = size;
        this.rotation_x = rotation_x;
        this.rotation_y = rotation_y;
        this.rotation_z = rotation_z;
        this.red_base = null;
      }
    }

    p.setup = () => {
      p.createCanvas(300, 600, p.WEBGL);
      p.frameRate(30);
      
      tomato_pg = p.createGraphics(128, 256, p.WEBGL);
      
      // NOWOŚĆ: Losowanie cech pomidora bezpośrednio przy inicjalizacji (odpowiednik Twojego nowego setupu)
      const randomSize = 30 * (1.0 + p.random(-0.125, 0.125));
      tomato = new Tomato(randomSize, 0, 0, 0);
      
      tomato.red_base = p.color(
        245 + Math.floor(p.random(-10, 10)), 
        p.random(0, 8), 
        p.random(0, 64), 
        255
      );

      x_rot_speed = p.random(-8, 8);
      y_rot_speed = p.random(-8, 8);
      z_rot_speed = p.random(-16, 16);
    };

    p.draw = () => {
      p.clear(0, 0, 0, 0); // Przezroczyste tło główne

      if(frame_ID == 0){
        p.noiseSeed(p.random(-10000000, 1000000));
      }
      
      if (frame_ID < max_tomato_frames) {
        tomato.rotation_x = Math.floor(-30 + frame_ID * x_rot_speed);
        tomato.rotation_y = Math.floor(0 + frame_ID * y_rot_speed);
        tomato.rotation_z = Math.floor(0 + frame_ID * z_rot_speed);
        
        tomato_pg.background(0, 0);
        
        tomato_pg.push();
        tomato_pg.translate(
          0, 
          -(tomato_pg.height / 2) * p.sin(frame_ID * 2.5 / max_tomato_frames), 
          -frame_ID * 60.0 / max_tomato_frames
        );
        
        tomato_pg.directionalLight(250, 250, 200, 0, 0, -1);
        tomato_pg.ambientLight(200, 200, 228);
        tomato_pg.noStroke();
        
        // RYSOWANIE CIAŁA POMIDORA
        for (let i = 0; i < 6; ++i) {
          tomato_pg.fill(
            p.red(tomato.red_base) + p.noise(10 * i, p.TWO_PI * i) * 50 - 25,
            p.green(tomato.red_base) + p.noise(i) * 64 - 32,
            p.blue(tomato.red_base)
          );
          
          tomato_pg.push();
          tomato_pg.translate(0, tomato_pg.height / 3, 0);
          
          tomato_pg.rotateX(p.TWO_PI * tomato.rotation_x / 360.0);
          tomato_pg.rotateY(p.TWO_PI * tomato.rotation_y / 360.0);
          tomato_pg.rotateZ(p.TWO_PI * tomato.rotation_z / 360.0);
          
          tomato_pg.rotateZ(p.TWO_PI / 6.0 * i);
          tomato_pg.translate(tomato.size * 0.125, 0, 0);
          tomato_pg.sphere(tomato.size - p.noise(i) * tomato.size * 0.1);
          tomato_pg.pop();
        }
        
        // RYSOWANIE LIŚCI
        for (let i = 0; i < 6; ++i) {
          tomato_pg.push();
          tomato_pg.translate(0, tomato_pg.height / 3, 0);
          
          tomato_pg.rotateX(p.TWO_PI * tomato.rotation_x / 360.0);
          tomato_pg.rotateY(p.TWO_PI * tomato.rotation_y / 360.0);
          tomato_pg.rotateZ(p.TWO_PI * tomato.rotation_z / 360.0);
          
          tomato_pg.rotateZ(p.TWO_PI / 6.0 * i);
          tomato_pg.translate(0, 0, tomato.size);
          
          tomato_pg.fill(
            32 + p.noise(i) * 64.0, 
            125 + p.noise(i) * 32.0, 
            0 + p.noise(i) * 4.0
          );
          
          tomato_pg.beginShape();
          tomato_pg.vertex(0, -tomato.size * 0.1, 0);
          tomato_pg.vertex(0, tomato.size * 0.1, 0);
          tomato_pg.vertex(tomato.size * 0.45 + p.noise(i) * 6.5, 0, p.noise(i) * tomato.size * 0.125);
          tomato_pg.endShape(p.CLOSE);
          tomato_pg.pop();
        }
        
        // ŁODYGA
        tomato_pg.push();
        tomato_pg.translate(0, tomato_pg.height / 3, 0);
          
        tomato_pg.rotateX(p.TWO_PI * tomato.rotation_x / 360.0);
        tomato_pg.rotateY(p.TWO_PI * tomato.rotation_y / 360.0);
        tomato_pg.rotateZ(p.TWO_PI * tomato.rotation_z / 360.0);
        
        tomato_pg.translate(0, 0, tomato.size);
        
        tomato_pg.strokeWeight(tomato.size * 0.1);
        tomato_pg.stroke(64, 180, 2);
        tomato_pg.line(
          0, 0, -tomato.size * 0.25, 
          p.noise(tomato.size) * tomato.size * 0.05, 
          p.noise(tomato.size) * tomato.size * 0.05, 
          tomato.size * 0.25
        );
        tomato_pg.pop();
        tomato_pg.pop();

      } else if (frame_ID < max_tomato_frames + max_splatter_frames) {
        // WYŚWIETLANIE ROZBRYZGU
        tomato_pg.background(0, 0, 0, 0);
        
        let value = (frame_ID - max_tomato_frames + 1) / max_splatter_frames;
        
        for (let i = 0; i < 128; ++i) {
          let alphaValue = p.max(255 - 500 * (p.pow(value, (1.0 - p.noise(i) * p.noise(i) * p.noise(i)) * 5)), 0);
          
          tomato_pg.fill(
            p.red(  tomato.red_base) + p.noise(10 * i, p.TWO_PI * i) * 50 - 25,
            p.green(tomato.red_base) + p.noise(i) * 64 - 32,
            p.blue( tomato.red_base),
            alphaValue
          );
          
          tomato_pg.noStroke();
          
          let calcFactor = p.sqrt(p.sin((frame_ID - max_tomato_frames + 3) * p.HALF_PI / max_splatter_frames)) * tomato.size + 1.0;
          let dropYOffset = 50.0 * p.min(1.0 - p.sqrt(p.cos((frame_ID - max_tomato_frames + 4) * p.HALF_PI / max_splatter_frames)), 0.75);
          
          tomato_pg.push();
          tomato_pg.translate(
            calcFactor * (p.noise(i, 100 * i / p.PI) - 0.5) * 5.0,
            calcFactor * (p.noise(i, p.sqrt(2) * i)  - 0.5) * 5.0 + dropYOffset + tomato_pg.height * 0.0,
            0
          );
          tomato_pg.circle(0, 0, (p.noise(i) * p.noise(i) + 0.1) * (1.5 - Math.pow(value, 6)) * tomato.size * 0.75);
          tomato_pg.pop();
        }
      }
      
      // Renderowanie gotowej tekstury na głównym ekranie
      p.push();
      p.texture(tomato_pg);
      p.noStroke();
      p.plane(p.width, p.height);
      p.pop();
      
      frame_ID++;

      // KROK KOŃCOWY: Gdy animacja dobiegnie końca (60 + 60 klatek), automatycznie usuwamy zasoby i zamykamy widok
      if (frame_ID >= max_tomato_frames + max_splatter_frames) {
        p.noLoop();
        myp5.remove();
        container.remove();
        onComplete();
      }
    };
  };

  const myp5 = new p5(sketch, container);

  // Zwracamy funkcję czyszczącą na wypadek np. nagłego odmontowania komponentu w React
  return () => {
    myp5.remove();
    container.remove();
  };
}
