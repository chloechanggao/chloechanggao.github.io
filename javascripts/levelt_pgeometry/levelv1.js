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

    scene.fog = new THREE.FogExp2(0xFFE4B5, 0.001);

    var light = new THREE.HemisphereLight(0xE6E6FA, 0xFFFFFF, 0.5);
    light.position.set(0, 250, 160);
    scene.add(light);
    var light = new THREE.DirectionalLight(0xFFFFFF, 0.75);
    light.position.set(0, 425, 125);
    light.castShadow = true;
    scene.add(light);
    var light = new THREE.DirectionalLight(0xFFFFFF, 0.085);
    light.position.set(-20, 5, 280);
    light.castShadow = true;
    scene.add(light);

    light.shadow.mapSize.width = 512;
    light.shadow.mapSize.height = 512;
    light.shadow.camera.near = 0.5;
    light.shadow.camera.far = 500;


    var loader = new THREE.ColladaLoader();
    loader.load('shared/bmodelv2.dae', function(result) {
        building = result.scene;
        mixer = new THREE.AnimationMixer(building);
        building.traverse(function(child) {
            if (child instanceof THREE.SkinnedMesh) {
                var clip = THREE.AnimationClip.parseAnimation(child.geometry.animation, child.geometry.bones);
                mixer.clipAction(clip, child).play();
            }
        });
        building.position.set(-53, 5, 244);
        building.rotation.set(3 * Math.PI / 2, 0, 2.3);
        building.scale.set(.2, .2, .2);

        var mesh = building.children[0].children[0];
        mesh.castShadow = true;
        mesh.receiveShadow = true;
        //building.children[1].castShadow = true;
        //building.children[1].receiveShadow = true;
        scene.add(building);
    });

    //environment

    var planeSize = 10000;
    var offset = 7;

    //plane1
    geometry = new THREE.PlaneGeometry(planeSize, planeSize);
    material = new THREE.MeshStandardMaterial({
        color: 0xF0F8FF,
        //map: boxTexture,
        side: THREE.DoubleSide
    });
    meshPlane1 = new THREE.Mesh(geometry, material);
    scene.add(meshPlane1);
    meshPlane1.position.set(0, planeSize / 2, 100);

    //plane2
    geometry = new THREE.PlaneGeometry(planeSize, planeSize);
    material = new THREE.MeshStandardMaterial({
        color: 0x1C1C1C,
        //map: boxTexture,
        side: THREE.DoubleSide
    });
    meshPlane2 = new THREE.Mesh(geometry, material);
    scene.add(meshPlane2);
    meshPlane2.position.set(0, -5000 + offset, 100);

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
    meshPlane3.position.set(0, offset, 0);
    geometry.rotateX(-Math.PI / 2);




    renderer = new THREE.WebGLRenderer();
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
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
    controls.update();

    renderer.render(scene, camera);

}
