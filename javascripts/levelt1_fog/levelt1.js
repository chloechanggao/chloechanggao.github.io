if (!Detector.webgl) {

    Detector.addGetWebGLMessage();
    document.getElementById('container').innerHTML = "";

}

var container, stats;

var camera, controls, scene, renderer;

var mesh, texture, geometry, material;

var worldWidth = window.innerWidth,
    worldDepth = window.innerHeight,
    worldHalfWidth = worldWidth / 2,
    worldHalfDepth = worldDepth / 2,
    VIEW_ANGLE = 45,
    ASPECT = worldWidth / worldDepth,
    NEAR = 0.1,
    FAR = 20000;
var clock = new THREE.Clock();

init();
animate();

function init() {

    container = document.getElementById('container');

    camera = new THREE.PerspectiveCamera(VIEW_ANGLE, ASPECT, NEAR, FAR);



    controls = new THREE.OrbitControls(camera);


    controls.enableZoom = false;
    controls.minAzimuthAngle = 0;
    controls.maxAzimuthAngle = 0;






    scene = new THREE.Scene();

    scene.background = new THREE.CubeTextureLoader()
        .setPath('shared/')
        .load(['1.png', '2.png', '5.png', '6.png', '3.png', '4.png']);



    var textureCube = new THREE.CubeTextureLoader()
        .setPath('textures/cube/Park3Med/')
        .load(['px.jpg', 'nx.jpg', 'py.jpg', 'ny.jpg', 'pz.jpg', 'nz.jpg']);
    textureCube.mapping = THREE.CubeRefractionMapping;

    scene.fog = new THREE.FogExp2(0xaaccff, 0.0007);

    var light = new THREE.HemisphereLight(0xFFFAF0, 0xFFFAF0, 2);
    light.position.set(0, 350, 100);
    scene.add(light);



    var texture = new THREE.TextureLoader().load("shared/floortexture.png");
    texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set(1, 1);

    material = new THREE.MeshStandardMaterial({
        //color: 0x0044ff,
        //map: texture,
        side: THREE.DoubleSide
    });

    geometry = new THREE.PlaneGeometry(200, 200);
    geometry.rotateX(-Math.PI / 2);
    camera.position.set(0, 30, 350);
    // controls.movementSpeed = 500;
    // controls.lookSpeed = 0.02;

    mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    renderer = new THREE.WebGLRenderer();
    renderer.setClearColor(0xFFFFFF);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.addEventListener('mousemove', onMouseWheel, false);

    container.innerHTML = "";

    container.appendChild(renderer.domElement);

    stats = new Stats();
    container.appendChild(stats.dom);

    //

    window.addEventListener('resize', onWindowResize, false);

}

function onMouseWheel(event) {
    console.log("hehe");

    var mouseX = event.clientX,
        mouseY = event.clientY;
    console.log(mouseY);
    camera.position.y = mouseY;


}

function onWindowResize() {

    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize(window.innerWidth, window.innerHeight);


}

//

function animate() {

    requestAnimationFrame(animate);

    render();
    stats.update();

}

function render() {

    // var delta = clock.getDelta();
    //controls.update();




    renderer.render(scene, camera);

}
