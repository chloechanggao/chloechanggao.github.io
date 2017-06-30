if (!Detector.webgl) {

    Detector.addGetWebGLMessage();
    document.getElementById('container').innerHTML = "";

}

var container, stats;

var camera, controls, scene, renderer;

var meshBox, meshPlane1, meshPlane2, meshPlane3, boxTexture, geometry, material;

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

    camera.position.set(0, 30, 350);

    controls.enableZoom = false;
    controls.minAzimuthAngle = 0;
    controls.maxAzimuthAngle = 0;
    controls.target = new THREE.Vector3(0, 0, -10000000);
    controls.rotateSpeed = 0.000001;







    scene = new THREE.Scene();

    // scene.background = new THREE.CubeTextureLoader()
    //     .setPath('shared/')
    //     .load(['1.png', '2.png', '5.png', '6.png', '3.png', '4.png']);
    //
    //
    //
    // var textureCube = new THREE.CubeTextureLoader()
    //     .setPath('textures/cube/Park3Med/')
    //     .load(['px.jpg', 'nx.jpg', 'py.jpg', 'ny.jpg', 'pz.jpg', 'nz.jpg']);
    // textureCube.mapping = THREE.CubeRefractionMapping;

    scene.fog = new THREE.FogExp2(0xaaccff, 0.0007);
    var light = new THREE.HemisphereLight(0xFFFAF0, 0xFFFAF0, 0.5);
    light.position.set(0, 250, 150);
    scene.add(light);
    var light = new THREE.DirectionalLight(0xFFFAF0, 1.5);
    light.position.set(0, 450, 150);
    scene.add(light);


    //box
    geometry = new THREE.BoxGeometry(50, 50, 50);

    var boxTexture = new THREE.TextureLoader().load("shared/floortexture.png");
    boxTexture.wrapS = boxTexture.wrapT = THREE.RepeatWrapping;
    boxTexture.repeat.set(1, 1);

    material = new THREE.MeshStandardMaterial({
        //color: 0x0044ff,
        //map: boxTexture,
        metalness: 0.7,
        side: THREE.DoubleSide
    });
    meshBox = new THREE.Mesh(geometry, material);
    scene.add(meshBox);
    meshBox.position.set(0, 0, 200);

    var planeSize = 10000;
    //plane1
    geometry = new THREE.PlaneGeometry(planeSize, planeSize);
    material = new THREE.MeshStandardMaterial({
        color: 0xF0F8FF,
        //map: boxTexture,
        side: THREE.DoubleSide
    });
    meshPlane1 = new THREE.Mesh(geometry, material);
    scene.add(meshPlane1);
    meshPlane1.position.set(0, planeSize / 2, 200);

    //plane2
    geometry = new THREE.PlaneGeometry(planeSize, planeSize);
    material = new THREE.MeshStandardMaterial({
        color: 0x1C1C1C,
        //map: boxTexture,
        side: THREE.DoubleSide
    });
    meshPlane2 = new THREE.Mesh(geometry, material);
    scene.add(meshPlane2);
    meshPlane2.position.set(0, -planeSize / 2, 200);

    //plane3
    geometry = new THREE.PlaneGeometry(planeSize, 600);
    material = new THREE.MeshStandardMaterial({
        transparent: true,
        color: 0xA1A1A1,
        //map: boxTexture,
        opacity: 0.9,
        side: THREE.DoubleSide
    });
    meshPlane3 = new THREE.Mesh(geometry, material);
    scene.add(meshPlane3);
    meshPlane3.position.set(0, 0, 0);
    geometry.rotateX(-Math.PI / 2);



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


    // var mouseX = event.clientX,
    //     mouseY = event.clientY;

    //camera.position.y = mouseY;


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
    controls.update();




    renderer.render(scene, camera);

}
