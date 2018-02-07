//
//  SecondViewController.swift
//  MobileLabUnlockScreenKit
//
//  Created by Nien Lam on 1/31/18.
//  Copyright © 2018 Mobile Lab. All rights reserved.
//

import UIKit

class SecondViewController: UIViewController {

    // Outlet for status label.
    @IBOutlet weak var statusLabel: UILabel!

    // Outlets to hexagon images.
    @IBOutlet weak var hexagon1ImageView: UIImageView!
    @IBOutlet weak var hexagon2ImageView: UIImageView!
    @IBOutlet weak var hexagon3ImageView: UIImageView!

    /////////////////////////////////
    // UNLOCK SEQEUNCE.
    // Used to compare to swipe pattern.
    let lockPattern = [3, 1, 2]
    /////////////////////////////////
    
    // Array to capture swipe pattern.
    var swipePattern = [Int]()

    
    override func viewDidLoad() {
        super.viewDidLoad()
    
        // Reset screen on app start.
        resetScreen()
    }

    // Helper method to reset the screen.
    func resetScreen() {
        // Initialize status label.
        statusLabel.text = "Now Swipe"
        
        // Update visual feedback.
        updateHexagonFeedback(hexagonNumber: 1, isOn: false)
        updateHexagonFeedback(hexagonNumber: 2, isOn: false)
        updateHexagonFeedback(hexagonNumber: 3, isOn: false)
        
        // Flush input pattern.
        swipePattern.removeAll()
    }

    // Helper method to update hexagon alpha for visual feedback.
    func updateHexagonFeedback(hexagonNumber: Int, isOn: Bool) {
        if hexagonNumber == 1 {
            hexagon1ImageView.alpha = isOn ? 0.2 : 1.0
        } else if hexagonNumber == 2 {
            hexagon2ImageView.alpha = isOn ? 0.2 : 1.0
        } else if hexagonNumber == 3 {
            hexagon3ImageView.alpha = isOn ? 0.2 : 1.0
        }
    }

    
    // Override touchesMoved method already provided by parent class.
    override func touchesMoved(_ touches: Set<UITouch>, with event: UIEvent?) {
        // Get first touch.
        if let firstTouch = touches.first {
            // Check which view user is touching.
            let hitView = self.view.hitTest(firstTouch.location(in: self.view), with: event)

            // Process swipe pattern based on which hexagon is touched.
            if hitView == hexagon1ImageView {
                processSwipePattern(hexagonNumber: 1)
            } else if hitView == hexagon2ImageView {
                processSwipePattern(hexagonNumber: 2)
            } else if hitView == hexagon3ImageView {
                processSwipePattern(hexagonNumber: 3)
            }
        }
    }

    // Override touchesEnded method already provided by parent class.
    override func touchesEnded(_ touches: Set<UITouch>, with event: UIEvent?) {
        // Reset the screen when user lifts touch off.
        resetScreen()
    }
    
    
    // Logic for different stages of the swipe sequence.
    func processSwipePattern(hexagonNumber: Int) {

        // Append hexagon number if swipePattern array is empty.
        if swipePattern.count == 0 {
            // Append passed in hexagonNumber into swipe pattern array.
            swipePattern.append(hexagonNumber)

            // Update visual feedback.
            updateHexagonFeedback(hexagonNumber: hexagonNumber, isOn: true)

        } else {
            // Only append new hexagon number if different from last hexagon number.
            // User touch could still be over same hexagon so do not capture hexagon number.
            if swipePattern.last != hexagonNumber {
                swipePattern.append(hexagonNumber)
                
                updateHexagonFeedback(hexagonNumber: hexagonNumber, isOn: true)
            }

            // When swipePattern array count hits 3, check against lockPattern.
            if swipePattern.count == 3 {
                statusLabel.text = (swipePattern == lockPattern) ? "Unlocked" : "Try Again"
            }
        }

    }

}

