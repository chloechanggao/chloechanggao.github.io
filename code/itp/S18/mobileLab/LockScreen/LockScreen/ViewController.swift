//
//  ViewController.swift
//  LockScreen
//
//  Created by Chang Gao on 2/14/18.
//  Copyright © 2018 chloelockscreen. All rights reserved.
//

import UIKit

class ViewController: UIViewController {

    @IBOutlet weak var statusLable: UILabel!
    
    @IBOutlet weak var circle1: UIImageView!
    @IBOutlet weak var circle2: UIImageView!
    @IBOutlet weak var circle3: UIImageView!
    @IBOutlet weak var circle4: UIImageView!
    @IBOutlet weak var circle5: UIImageView!
    @IBOutlet weak var circle6: UIImageView!
    @IBOutlet weak var circle7: UIImageView!
    @IBOutlet weak var circle8: UIImageView!
    @IBOutlet weak var circle9: UIImageView!
    @IBOutlet weak var circle10: UIImageView!
    @IBOutlet weak var circle11: UIImageView!
    @IBOutlet weak var circle12: UIImageView!
    
    let lockPattern = [8, 9, 3, 4, 5]
    var swipePattern = [Int]()
    
    
    override func viewDidLoad() {
        super.viewDidLoad()
        
        resetScreen()
        
    }
    
    func resetScreen() {
        // Initialize status label.
        statusLable.text = "Swipe To Unlock"
        
        // Update visual feedback.
        updateCircleFeedback(circleNumber: 1, isOn: false)
        updateCircleFeedback(circleNumber: 2, isOn: false)
        updateCircleFeedback(circleNumber: 3, isOn: false)
        updateCircleFeedback(circleNumber: 4, isOn: false)
        updateCircleFeedback(circleNumber: 5, isOn: false)
        updateCircleFeedback(circleNumber: 6, isOn: false)
        updateCircleFeedback(circleNumber: 7, isOn: false)
        updateCircleFeedback(circleNumber: 8, isOn: false)
        updateCircleFeedback(circleNumber: 9, isOn: false)
        updateCircleFeedback(circleNumber: 10, isOn: false)
        updateCircleFeedback(circleNumber: 11, isOn: false)
        updateCircleFeedback(circleNumber: 12, isOn: false)

        swipePattern.removeAll()
        
    }
    
    func updateCircleFeedback(circleNumber: Int, isOn: Bool) {
        if circleNumber == 1 {
            circle1.alpha = isOn ? 0.2 : 1.0
        } else if circleNumber == 2 {
            circle2.alpha = isOn ? 0.2 : 1.0
        } else if circleNumber == 3 {
            circle3.alpha = isOn ? 0.2 : 1.0
        } else if circleNumber == 4 {
            circle4.alpha = isOn ? 0.2 : 1.0
        } else if circleNumber == 5 {
            circle5.alpha = isOn ? 0.2 : 1.0
        } else if circleNumber == 6 {
            circle6.alpha = isOn ? 0.2 : 1.0
        } else if circleNumber == 7 {
            circle7.alpha = isOn ? 0.2 : 1.0
        } else if circleNumber == 8 {
            circle8.alpha = isOn ? 0.2 : 1.0
        } else if circleNumber == 9 {
            circle9.alpha = isOn ? 0.2 : 1.0
        } else if circleNumber == 10 {
            circle10.alpha = isOn ? 0.2 : 1.0
        } else if circleNumber == 11 {
            circle11.alpha = isOn ? 0.2 : 1.0
        } else if circleNumber == 12 {
            circle12.alpha = isOn ? 0.2 : 1.0
        }
    }



    override func touchesMoved(_ touches: Set<UITouch>, with event: UIEvent?) {
        // Get first touch.
        if let firstTouch = touches.first {
            // Check which view user is touching.
            let hitView = self.view.hitTest(firstTouch.location(in: self.view), with: event)
           
            if hitView == circle1 {
                processSwipePattern(circleNumber: 1)
            } else if hitView == circle2 {
                processSwipePattern(circleNumber: 2)
            } else if hitView == circle3 {
                processSwipePattern(circleNumber: 3)
            } else if hitView == circle4 {
                processSwipePattern(circleNumber: 4)
            } else if hitView == circle5 {
                processSwipePattern(circleNumber: 5)
            } else if hitView == circle6 {
                processSwipePattern(circleNumber: 6)
            } else if hitView == circle7 {
                processSwipePattern(circleNumber: 7)
            } else if hitView == circle8 {
                processSwipePattern(circleNumber: 8)
            } else if hitView == circle9 {
                processSwipePattern(circleNumber: 9)
            } else if hitView == circle10 {
                processSwipePattern(circleNumber: 10)
            } else if hitView == circle11 {
                processSwipePattern(circleNumber: 11)
            } else if hitView == circle12 {
                processSwipePattern(circleNumber: 12)
            }
        }
    }
    
    // Override touchesEnded method already provided by parent class.
    override func touchesEnded(_ touches: Set<UITouch>, with event: UIEvent?) {
        // Reset the screen when user lifts touch off.
        resetScreen()
    }
    
    
    // Logic for different stages of the swipe sequence.
    func processSwipePattern(circleNumber: Int) {
        
    
        if swipePattern.count == 0 {
            swipePattern.append(circleNumber)
            
            // Update visual feedback.
            updateCircleFeedback(circleNumber: circleNumber, isOn: true)
            
        } else {
          
         
            if swipePattern.last != circleNumber {
                swipePattern.append(circleNumber)
                
                updateCircleFeedback(circleNumber: circleNumber, isOn: true)
            }
            

            if swipePattern.count == 5 {
                if swipePattern == lockPattern{
                    statusLable.text = "Unlocked"
                    
                    let storyboard = UIStoryboard(name: "Main", bundle: nil)
                    
                    let secondViewController = storyboard.instantiateViewController(withIdentifier: "SecondViewController")
                    
                    self.present(secondViewController, animated: true, completion: nil)
                } else{
                    statusLable.text = "Try Again"
                }

            }
        }
        
    }
    


}

