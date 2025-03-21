class Frog extends Enemy
{
	constructor( pos )
	{
		super( pos,"Images/Enemy/Frog.png" )
		this.hp = 25
		
		this.spd = 0.62
		
		this.attackTimer = new Timer( 2.1,false,true )
		this.attackPattern = null
		this.sprayPattern = new SprayPattern( new ShotPattern( 3,35 ),10,0.25,3,true )
		this.bulletSpd = 1.1
		this.bulletRange = 200
	}
}