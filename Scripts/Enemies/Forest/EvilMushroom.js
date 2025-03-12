class EvilMushroom extends Enemy
{
	constructor( pos )
	{
		super( pos,"Images/Enemy/Mushroom.png" )
		this.hp = 14
		
		this.spd = 0.32
		
		this.attackTimer = new Timer( 2.1,false,true )
		this.attackPattern = null
		this.sprayPattern = new SprayPattern( new ShotPattern( 2,35 ),30,0.25,2,true )
		this.bulletSpd = 1.1
		this.bulletRange = 200
	}
}