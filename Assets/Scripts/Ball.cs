using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using TMPro;

public class Ball : MonoBehaviour
{
    public TextMeshProUGUI mtext;
    public float speed = 3f; 
    Vector3 movimientoHorizontal = Vector3.right;
    Vector3 movimientoVertical = Vector3.up;
    int goleslocales = 0;
    int golesvisitante = 0;
   
    

    // Start is called before the first frame update
    void Start()
    {

    }

    // Update is called once per frame
    void Update()
    {
        transform.position += (movimientoHorizontal + movimientoVertical) * Time.deltaTime * speed;

    }
    private void OnCollisionEnter2D(Collision2D collision)
    {
        if (collision.gameObject.tag == "Vertical")
        {


            movimientoVertical = -movimientoVertical;

        }
        if (collision.gameObject.tag == "Horizontal")
        {

            movimientoHorizontal = -movimientoHorizontal;

        }
        if (collision.gameObject.tag == "Player")
        {


            movimientoVertical = -movimientoVertical;
            movimientoHorizontal = -movimientoHorizontal;
        }
        if (collision.gameObject.tag == "Goal1")
        {

            golesvisitante++;
            UpdateMarker();
            ResetBall();



        }
        if (collision.gameObject.tag == "Goal2")
        {

            goleslocales++;
            UpdateMarker();
            ResetBall();
        }
    }
    void ResetBall()
    {
        transform.position = Vector3.zero;
        movimientoVertical = -movimientoVertical;
        movimientoHorizontal = -movimientoHorizontal;
    }
    void UpdateMarker() 
    
    {
        mtext.text = goleslocales.ToString() + ":" + golesvisitante.ToString();
    }
}