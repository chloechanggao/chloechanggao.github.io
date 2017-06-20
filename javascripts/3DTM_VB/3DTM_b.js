if (!Detector.webgl) Detector.addGetWebGLMessage();

var renderer, scene, camera, stats, controls;

var mesh, uniforms, geometry;

var WIDTH = window.innerWidth,
    HEIGHT = window.innerHeight;

var loader = new THREE.FontLoader();
loader.load('shared/optimer_bold.typeface.json', function(font) {

    init(font);
    animate();

});

//color white: 0xFFFFF0, grey: 0xC1CDCD,black:	0x2E2E2E;

function init(font) {

    camera = new THREE.PerspectiveCamera(25, WIDTH / HEIGHT,1, 9000);
    camera.position.set(120, -250, 300);

    controls = new THREE.TrackballControls(camera);

    scene = new THREE.Scene();

    scene.background = new THREE.CubeTextureLoader()
        .setPath('shared/')
        .load(['bl1.jpg', 'bl2.jpg', 'bl6.jpg', 'bl5.jpg', 'bl3.jpg', 'bl4.jpg']);



    var textureCube = new THREE.CubeTextureLoader()
        .setPath('textures/cube/Park3Med/')
        .load(['px.jpg', 'nx.jpg', 'py.jpg', 'ny.jpg', 'pz.jpg', 'nz.jpg']);
    textureCube.mapping = THREE.CubeRefractionMapping;

    scene.fog = new THREE.FogExp2(0xFFFFF0, 0.0025);

    scene.fog.color.setHSL(1, 0, 1);



    geometry = new THREE.TextGeometry("Oh Monday", {

        font: font,

        size: 40,
        height: 5,
        curveSegments: 3,

        bevelThickness: 2,
        bevelSize: 1,
        bevelEnabled: true

    });

    geometry.center();

    var tessellateModifier = new THREE.TessellateModifier(3);

    for (var i = 0; i < 5; i++) {

        tessellateModifier.modify(geometry);

    }
    var numFaces = geometry.faces.length;

    //

    geometry = new THREE.BufferGeometry().fromGeometry(geometry);

    var colors = new Float32Array(numFaces * 3 * 3);
    var displacement = new Float32Array(numFaces * 3 * 3);

    var color = new THREE.Color();

    for (var f = 0; f < numFaces; f++) {

        var index = 9 * f;

        // var h = 0.7 * Math.random();
        // var s = 0.2 + 0.5 * Math.random(); //0.7 + 0.5 * Math.random();
        // var l = 0.6 + 0.9 * Math.random();
        // color.setHSL(h, s, l);
        // var white = new THREE.Color(0xFFFFF0);
        // var grey = new THREE.Color(0xC1CDCD);
        // var black = new THREE.Color(0x2E2E2E);
        //grey (yellowi)
        //var choices = [0xFFFFF0, 0xFFD700, 	0xFFEFD5, 0xFFFACD, 0xCD9B1D];
        //grey (blueish)
        var choices = [0xFFFFF0, 0xF0F8FF	, 0xE0EEEE, 0x838B8B, 0xEEE9E9];
        //black
        //var choices = [	0x1A1A1A, 0x030303, 0x1F1F1F, 0x242424, 0x2E2E2E];

        color = new THREE.Color(choices[THREE.Math.randInt(0, choices.length-1)]);

        var d = 10 * (0.5 - Math.random());

        for (var i = 0; i < 3; i++) {

            colors[index + (3 * i)] = color.r;
            colors[index + (3 * i) + 1] = color.g;
            colors[index + (3 * i) + 2] = color.b;

            displacement[index + (3 * i)] = d;
            displacement[index + (3 * i) + 1] = d;
            displacement[index + (3 * i) + 2] = d;

        }

    }

    geometry.addAttribute('customColor', new THREE.BufferAttribute(colors, 3));
    geometry.addAttribute('displacement', new THREE.BufferAttribute(displacement, 3));

    //

    uniforms = {
        amplitude: {
            value: 1.0
        },
        stimu: {
            value: [0, 0, 0]
        },
        lightpos: {
            value: [0, 0, 10]
        },
    };


    var shaderMaterial = new THREE.ShaderMaterial({

        uniforms: uniforms,
        vertexShader: document.getElementById('vertexshader').textContent,
        fragmentShader: document.getElementById('fragmentshader').textContent

    });

    //

    mesh = new THREE.Mesh(geometry, shaderMaterial);

    scene.add(mesh);

    renderer = new THREE.WebGLRenderer({
        antialias: true
    });

    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(WIDTH, HEIGHT);
    renderer.setClearColor(scene.fog.color);
    document.addEventListener('mousemove', onMouseMove, false);

    var container = document.getElementById('container');
    container.appendChild(renderer.domElement);

    stats = new Stats();
    container.appendChild(stats.dom);

    //

    window.addEventListener('resize', onWindowResize, false);
}

function onWindowResize() {

    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize(window.innerWidth, window.innerHeight);

}

//onDocumentMouseMove = false;
var mouseMoving = Date.now() - 3000;

function onMouseMove(e) {

    var mouseX = e.clientX,
        mouseY = e.clientY;

    var x = THREE.Math.mapLinear(mouseX, 0, 1000, -100, 100);
    var y = THREE.Math.mapLinear(mouseY, 0, 1000, -20, 20);

    uniforms.stimu.value = [x, y, 0];
    mouseMoving = Date.now();
    //console.log(uniforms.amplitude.value);
    //console.log("mouse moving " + mouseMoving);
}





function animate() {
    requestAnimationFrame(animate);
    render();
    stats.update();

}



function render() {
    //console.log("mouse moving " + mouseMoving);

    var time = Date.now() * 0.005;
    var sinPause = Math.sin(time * 0.4);
    if (sinPause < -0.5){
      sinPause = -0.5;
    }
    uniforms.amplitude.value = 0.7 + sinPause;
    controls.update();

    renderer.render(scene, camera);
}
