if (!Detector.webgl) Detector.addGetWebGLMessage();

var renderer, scene, camera, stats;

var mesh, uniforms;

var WIDTH = window.innerWidth,
    HEIGHT = window.innerHeight;

var loader = new THREE.FontLoader();
loader.load('shared/helvetiker_bold.typeface.json', function(font) {

    init(font);
    animate();

});

function init(font) {

    camera = new THREE.PerspectiveCamera(40, WIDTH / HEIGHT, 1, 10000);
    camera.position.set(-100, 100, 200);

    controls = new THREE.TrackballControls(camera);

    scene = new THREE.Scene();

    //

    var geometry = new THREE.TextGeometry("Outernets", {

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

    // var explodeModifier = new THREE.ExplodeModifier();
    // explodeModifier.modify(geometry);

    var numFaces = geometry.faces.length;

    //

    geometry = new THREE.BufferGeometry().fromGeometry(geometry);

    var colors = new Float32Array(numFaces * 3 * 3);
    var displacement = new Float32Array(numFaces * 3 * 3);

    var color = new THREE.Color();

    for (var f = 0; f < numFaces; f++) {

        var index = 9 * f;

        var h = 0.2 * Math.random();
        var s = 0.2 + 0.5 * Math.random();
        var l = 0.7 + 0.5 * Math.random();

        color.setHSL(h, s, l);

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
        }

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
    renderer.setClearColor(0xC1CDCD);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(WIDTH, HEIGHT);
    document.addEventListener('mousemove', onDocumentMouseMove, false);

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
var mouseMoving = false;

function onDocumentMouseMove(event) {

    // var time = Date.now() * 0.005;
    // uniforms.amplitude.value = 1.2 + Math.sin(time * 0.4);
    var mouseX = ( event.clientX / window.innerWidth ) * 2 - 1;
    var x = THREE.Math.mapLinear(mouseX, 0, 150, 0.2, 2000);
    uniforms.amplitude.value = x;
    mouseMoving = true;
    console.log(uniforms.amplitude.value);
    //console.log("mouse moving " + mouseMoving);
}




function animate() {
    requestAnimationFrame(animate);
    render();
    stats.update();

}

function render() {
    console.log("mouse moving " + mouseMoving);
    if (!mouseMoving) {
        var time = Date.now() * 0.005;
        uniforms.amplitude.value = 1.2 + Math.sin(time * 0.4);
        controls.update();
    } else {
        controls.update();
    }

    renderer.render(scene, camera);

}
