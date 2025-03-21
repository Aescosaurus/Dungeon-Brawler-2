class FlyEnemy extends Enemy
{
	constructor( pos )
	{
		super( pos,"Images/Enemy/Fly.png" )
		this.hp = 8
		
		this.spd = 0.4
		
		this.ai = new WiggleAI( 0.02 )
		
		this.attackTimer = new Timer( 2.0,false,true )
		this.attackPattern = new ShotPattern( 1 )
		this.bulletSpd = 0.8
		this.bulletRange = 50
	}
}