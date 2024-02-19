class TavernBrawler extends Enemy
{
	constructor( pos )
	{
		super( pos,"Images/Enemy/TavernBrawler.png" )
		this.hp = 7
		
		this.spd = 0.3
		
		this.attackTimer = new Timer( 2.5,false,true )
		this.attackPattern = new ShotPattern( 1 )
		this.bulletSpd = 0.8
		this.bulletRange = 80
	}
}