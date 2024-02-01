class MagicBullet extends Bullet
{
	constructor( pos,ang,minSpd,maxSpd,speedupRate,range )
	{
		super( pos,ang,minSpd,range,SpriteCodex.LoadSpr( "Images/Bullet/MagicBullet.png" ) )
		
		this.maxSpd = maxSpd
		this.speedupRate = speedupRate
		this.deactivateDist = this.maxSpd * 2
	}
	
	Update( map,targets )
	{
		super.Update( map,targets )
		
		if( this.seekTarget &&
			this.seekTarget.pos.Copy().Subtract( this.pos ).GetLenSq() < Math.pow( this.deactivateDist,2 ) )
		{
			this.SetSeekTarget( null )
		}
		
		if( this.spd < this.maxSpd )
		{
			this.spd += this.speedupRate
			this.vel.Normalize().Scale( this.spd )
		}
	}
	
	IsDead()
	{
		return( super.IsDead() )
	}
}