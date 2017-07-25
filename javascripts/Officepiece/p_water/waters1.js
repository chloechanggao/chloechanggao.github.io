  if (!Detector.webgl) Detector.addGetWebGLMessage();

  var hash = document.location.hash.substr(1);
  if (hash) hash = parseInt(hash, 0);

  // Texture width for simulation
  var WIDTH = hash || 128;
  var NUM_TEXELS = WIDTH * WIDTH;

  // Water size in system units
  var BOUNDS = 650;


  var container, stats;
  var camera, scene, renderer, controls, picPlane;
  var mouseMoved = false;
  var mouseCoords = new THREE.Vector2();
  var raycaster = new THREE.Raycaster();

  var waterMesh;
  var meshRay;
  var gpuCompute;
  var heightmapVariable;
  var waterUniforms;
  var smoothShader;

  var simplex = new SimplexNoise();

  var windowHalfX = window.innerWidth / 2;
  var windowHalfY = window.innerHeight / 2;

  var logoLoader = new THREE.ImageLoader();

// load a image resource
logoLoader.load(
	// resource URL
	'shared/outernets-logo.png',
	// Function when resource is loaded
	function ( logoimg ) {
		// do something with it
    var logoCanvas = document.createElement("canvas");
    var canvasctx = logoCanvas.getContext("2d");
    canvasctx.drawImage(logoimg, 0, 0);
    var imagedata = canvasctx.getImageData(0, 0, BOUNDS*2, BOUNDS);
    // for (i = 0; i < imagedata.data.length; i++) {
    //     if (imagedata.data[i] != 0) {
    //         console.log(imagedata.data[i]);
    //     }
    // }
    console.log(imagedata.data.length);
    init(imagedata);
    animate();

	},
	// Function called when download progresses
	function ( xhr ) {
		console.log( (xhr.loaded / xhr.total * 100) + '% loaded' );
	},
	// Function called when download errors
	function ( xhr ) {
		console.log( 'An error happened' );
	}
);








  function init(imagedata) {

      container = document.createElement('div');
      document.body.appendChild(container);

      camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 3000);
      camera.position.set(0, 200, 350);

      scene = new THREE.Scene();

      var geometry = new THREE.PlaneGeometry(400, 400);
      var texture = new THREE.TextureLoader().load('shared/outernets-logo.png');
      var material = new THREE.MeshStandardMaterial({
          map: texture,
          transparent: true,
          opacity: 1
      });
      picPlane = new THREE.Mesh(geometry, material);
      picPlane.position.set(0, 0, -15);
      picPlane.rotation.x = -Math.PI / 5.5;
      scene.add(picPlane);


      //lights on the water
      var sun = new THREE.DirectionalLight(0xFFFFFF, 1.0);
      sun.position.set(300, 400, 175);
      scene.add(sun);

      var sun2 = new THREE.DirectionalLight(0xF0F8FF, 0.8);
      sun2.position.set(-100, 350, -200);
      scene.add(sun2);

      renderer = new THREE.WebGLRenderer();
      renderer.setClearColor(0xFFFFFF);
      //var gl = renderer.getContext();
      //gl.enable(gl.GL_BLEND);

      renderer.setPixelRatio(window.devicePixelRatio);
      renderer.setSize(window.innerWidth, window.innerHeight);
      container.appendChild(renderer.domElement);

      controls = new THREE.OrbitControls(camera, renderer.domElement);


      stats = new Stats();
      container.appendChild(stats.dom);

      document.addEventListener('mousemove', onDocumentMouseMove, false);
      document.addEventListener('touchstart', onDocumentTouchStart, false);
      document.addEventListener('touchmove', onDocumentTouchMove, false);

      document.addEventListener('keydown', function(event) {


          // W Pressed: Toggle wireframe 干啥呢这是？
          if (event.keyCode === 87) {

              waterMesh.material.wireframe = !waterMesh.material.wireframe;
              waterMesh.material.needsUpdate = true;

          }

      }, false);

      window.addEventListener('resize', onWindowResize, false);



      var effectController = {
          opacity: 0.5
          //mouseSize: 25.0,
          //viscosity: 0.015,

      };
      initWater(imagedata);

      var gui = new dat.GUI();
      var valuesChanger = function() {
        material.opacity = effectController.opacity;
        //heightmapVariable.material.uniforms.mouseSize.value = effectController.mouseSize;
        //heightmapVariable.material.uniforms.viscosityConstant.value = effectController.viscosity;

      };

      gui.add( effectController, "opacity", 0.1, 1.0, 0.1 ).onChange( valuesChanger );
      //gui.add( effectController, "viscosity", 0.0, 0.1, 0.001 ).onChange( valuesChanger );
      // var buttonSmooth = {
      //     smoothWater: function() {
      //   smoothWater();
      //     }
      // };
      //gui.add( buttonSmooth, 'smoothWater' );

      valuesChanger();

      }




  function initWater(imagedata) {

      var materialColor = 0xF0F8FF;

      var texture = new THREE.TextureLoader().load('shared/outernets-logo.png');

      var geometry = new THREE.PlaneBufferGeometry(BOUNDS, BOUNDS, WIDTH - 1, WIDTH - 1);
      var material = new THREE.ShaderMaterial({
          uniforms: THREE.UniformsUtils.merge([
              THREE.ShaderLib['phong'].uniforms,
              {
                  map: texture,
                  txt: { type: 't', value: 0, texture: THREE.ImageUtils.loadTexture( 'shared/outernets-logo.png' ) },
                  heightmap: {
                      value: null
                  }
              }
          ]),
          vertexShader: document.getElementById('waterVertexShader').textContent,
          fragmentShader: document.getElementById('newphong_frag').textContent
          // THREE.ShaderLib[ 'phong' ].fragmentShader
          // THREE.ShaderChunk[ 'meshphong_frag' ]
      });

      var imagecolor = new Float32Array(imagedata.data.length);
      for (i = 0; i < imagecolor.length; i++) {
        imagecolor[i] = imagedata.data[i]/255.0;
          // if (i % 4 == 3 && imagecolor[i] != 0) {
          //     console.log(imagecolor[i]);
          // }
      }
      //console.log(imagecolor.length);
      geometry.addAttribute( 'imagecolor', new THREE.BufferAttribute( imagecolor, 4 ) );

      material.lights = true;
      material.transparent = true;
      // Material attributes from MeshPhongMaterial
      material.color = new THREE.Color(materialColor);
      material.specular = new THREE.Color(0xF0F8FF);
      material.shininess = 500;
      material.opacity = .9;
      // Sets the uniforms with the material values
      material.uniforms.diffuse.value = material.color;
      material.uniforms.specular.value = material.specular;
      material.uniforms.shininess.value = Math.max(material.shininess, 1e-4);
      material.uniforms.opacity.value = material.opacity;
      // Defines
      material.defines.WIDTH = WIDTH.toFixed(1);
      material.defines.BOUNDS = BOUNDS.toFixed(1);

      waterUniforms = material.uniforms;
      waterMesh = new THREE.Mesh(geometry, material);
      waterMesh.rotation.x = -Math.PI / 5.5;
      waterMesh.matrixAutoUpdate = false;
      waterMesh.updateMatrix();
      scene.add(waterMesh);

      // Mesh just for mouse raycasting
      var geometryRay = new THREE.PlaneBufferGeometry(BOUNDS, BOUNDS, WIDTH - 1, WIDTH - 1);
      meshRay = new THREE.Mesh(geometryRay, new THREE.MeshBasicMaterial({
          color: 0xFFFFFF,
          visible: false
      }));
      meshRay.rotation.x = -Math.PI / 4;
      meshRay.matrixAutoUpdate = false;
      meshRay.updateMatrix();
      scene.add(meshRay);


      // Creates the gpu computation class and sets it up

      gpuCompute = new GPUComputationRenderer(WIDTH, WIDTH, renderer);

      var heightmap0 = gpuCompute.createTexture();

      fillTexture(heightmap0);

      heightmapVariable = gpuCompute.addVariable("heightmap", document.getElementById('heightmapFragmentShader').textContent, heightmap0);

      gpuCompute.setVariableDependencies(heightmapVariable, [heightmapVariable]);

      heightmapVariable.material.uniforms.mousePos = {
          value: new THREE.Vector2(10000, 10000)
      };
      heightmapVariable.material.uniforms.mouseSize = {
          value: 20.0
      };
      heightmapVariable.material.uniforms.viscosityConstant = {
          value: 0.03
      };
      heightmapVariable.material.defines.BOUNDS = BOUNDS.toFixed(1);

      var error = gpuCompute.init();
      if (error !== null) {
          console.error(error);
      }

      // Create compute shader to smooth the water surface and velocity
      smoothShader = gpuCompute.createShaderMaterial(document.getElementById('smoothFragmentShader').textContent, {
          texture: {
              value: null
          }
      });

  }

  function fillTexture(texture) {

      var waterMaxHeight = 20;

      function noise(x, y, z) {
          var multR = waterMaxHeight;
          var mult = 0.025;
          var r = 0;
          for (var i = 0; i < 15; i++) {
              r += multR * simplex.noise(x * mult, y * mult);
              multR *= 0.53 + 0.025 * i;
              mult *= 1.25;
          }
          return r;
      }

      var pixels = texture.image.data;

      var p = 0;
      for (var j = 0; j < WIDTH; j++) {
          for (var i = 0; i < WIDTH; i++) {

              var x = i * 128 / WIDTH;
              var y = j * 128 / WIDTH;

              pixels[p + 0] = noise(x, y, 123.4);
              pixels[p + 1] = 0;
              pixels[p + 2] = 0;
              pixels[p + 3] = 1;

              p += 4;
          }
      }

  }

  function smoothWater() {

      var currentRenderTarget = gpuCompute.getCurrentRenderTarget(heightmapVariable);
      var alternateRenderTarget = gpuCompute.getAlternateRenderTarget(heightmapVariable);

      for (var i = 0; i < 10; i++) {

          smoothShader.uniforms.texture.value = currentRenderTarget.texture;
          gpuCompute.doRenderTarget(smoothShader, alternateRenderTarget);

          smoothShader.uniforms.texture.value = alternateRenderTarget.texture;
          gpuCompute.doRenderTarget(smoothShader, currentRenderTarget);

      }

  }


  function onWindowResize() {

      windowHalfX = window.innerWidth / 2;
      windowHalfY = window.innerHeight / 2;

      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();

      renderer.setSize(window.innerWidth, window.innerHeight);

  }

  function setMouseCoords(x, y) {

      mouseCoords.set((x / renderer.domElement.clientWidth) * 2 - 1, -(y / renderer.domElement.clientHeight) * 2 + 1);
      mouseMoved = true;

  }

  function onDocumentMouseMove(event) {

      setMouseCoords(event.clientX, event.clientY);

  }

  function onDocumentTouchStart(event) {

      if (event.touches.length === 1) {

          event.preventDefault();

          setMouseCoords(event.touches[0].pageX, event.touches[0].pageY);


      }

  }

  function onDocumentTouchMove(event) {

      if (event.touches.length === 1) {

          event.preventDefault();
          setMouseCoords(event.touches[0].pageX, event.touches[0].pageY);


      }

  }

  function animate() {

      requestAnimationFrame(animate);
      render();
      stats.update();

  }

  function render() {

      // Set uniforms: mouse interaction
      var uniforms = heightmapVariable.material.uniforms;
      if (mouseMoved) {

          this.raycaster.setFromCamera(mouseCoords, camera);
          var intersects = this.raycaster.intersectObject(meshRay);
          if (intersects.length > 0) {

              var point = intersects[0].point;
              uniforms.mousePos.value.set(point.x, point.z);

          } else {

              uniforms.mousePos.value.set(10000, 10000);
          }
          mouseMoved = false;
      } else {

          uniforms.mousePos.value.set(10000, 10000);

      }

      // Do the gpu computation
      gpuCompute.compute();

      // Get compute output in custom uniform
      waterUniforms.heightmap.value = gpuCompute.getCurrentRenderTarget(heightmapVariable).texture;

      // Render
      renderer.render(scene, camera);

  }
