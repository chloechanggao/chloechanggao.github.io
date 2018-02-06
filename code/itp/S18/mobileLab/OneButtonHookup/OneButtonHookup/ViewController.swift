//
//  ViewController.swift
//  OneButtonHookup
//
//  Created by Chang Gao on 1/31/18.
//  Copyright © 2018 changgao. All rights reserved.
//

import UIKit

class ViewController: UIViewController {

    @IBOutlet weak var myButton: UIButton!

    @IBOutlet weak var myImageView: UIImageView!
    
    override func viewDidLoad() {
        super.viewDidLoad()
        
   
    }

    override func didReceiveMemoryWarning() {
        super.didReceiveMemoryWarning()
        // Dispose of any resources that can be recreated.
    }

    @IBAction func handleButton(_
        sender: UIButton) {

        myButton.setTitle("Have a Nice Day :)", for: .normal)
         myImageView.image = UIImage(named: "weather.jpg")
    }
    
}

