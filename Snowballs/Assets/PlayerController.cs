using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class PlayerController : MonoBehaviour
{
    public Rigidbody2D rb;
    private Vector2 aimVector = new Vector2 (0,0);
    float speed = 5f;
    private float maxSpeed = 10f;
    private float accelTime = 1f;
    private float decelTime = 1f;
    public int playerNumber;
    void Update()
    {
        aimVector = new Vector2(0,0);
        rb.velocity = new Vector2(0, rb.velocity.y);
        if (playerNumber == 1) {
           if (Input.GetKey(KeyCode.W)) {
            aimVector = new Vector2 (aimVector.x, 1);
            } else if (Input.GetKey(KeyCode.S)) {
                rb.velocity = new Vector2(rb.velocity.x, -speed * 1.5f);
                aimVector = new Vector2 (aimVector.x, -1);
            }
            if (Input.GetKey(KeyCode.A)) {
                rb.velocity = new Vector2(-speed, rb.velocity.y);
                aimVector = new Vector2 (-1, aimVector.y);
            } else if (Input.GetKey(KeyCode.D)) {            
                rb.velocity = new Vector2(speed, rb.velocity.y);
                aimVector = new Vector2 (1, aimVector.y);
            }
            // if (Input.GetKeyDown(KeyCode.Space)) {
            //     rb.velocity = new Vector2(rb.velocity.x, speed * 2);

            // }
            if (Input.GetKeyDown(KeyCode.W)) {
                rb.velocity = new Vector2(rb.velocity.x, speed * 2);

            } 
        }
        if (playerNumber == 2) {
           if (Input.GetKey(KeyCode.O)) {
                aimVector = new Vector2 (aimVector.x, 1);
            } else if (Input.GetKey(KeyCode.L)) {
                rb.velocity = new Vector2(rb.velocity.x, -speed * 1.5f);
                aimVector = new Vector2 (aimVector.x, -1);
            }
            if (Input.GetKey(KeyCode.K)) {
                Debug.Log("bike");
                rb.velocity = new Vector2(-speed, rb.velocity.y);
                aimVector = new Vector2 (-1, aimVector.y);
            } else if (Input.GetKey(KeyCode.Semicolon)) {            
                rb.velocity = new Vector2(speed, rb.velocity.y);
                aimVector = new Vector2 (1, aimVector.y);
            }
            // if (Input.GetKeyDown(KeyCode.Space)) {
            //     rb.velocity = new Vector2(rb.velocity.x, speed * 2);

            // }
            if (Input.GetKeyDown(KeyCode.O)) {
                rb.velocity = new Vector2(rb.velocity.x, speed * 2);

            } 
        }
        
        // AccelerateTo(aimVector.x);
        
    }
    void AccelerateTo(float moveX) {
        if (moveX < 0) {
            rb.velocity = new Vector2(Mathf.Min(speed * accelTime * Time.deltaTime, maxSpeed), rb.velocity.y);
        } else if (moveX > 0) {
            rb.velocity = new Vector2(Mathf.Max(speed * accelTime * Time.deltaTime, -maxSpeed), rb.velocity.y);
        }
    }
}
