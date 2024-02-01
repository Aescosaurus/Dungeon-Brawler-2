class MaceBullet extends Bullet
{
	constructor( spinParent,spinRange,spinSpd )
	{
		super( spinParent.pos.Copy().Add( Vec2.Right().Scale( spinRange ) ),
			0,0,9999,SpriteCodex.LoadSpr( "Images/Bullet/Mace.png" ) )
		this.size = Vec2.One().Scale( 6 )
		
		this.ScaleUp( 1.5 )
		
		this.SetTriggerPierce( true )
		
		this.spinParent = spinParent
		this.spinRange = spinRange
		this.spinSpd = Utils.Deg2Rad( spinSpd )
		
		this.dmgInterval = 0.3
		this.dmgCounters = []
		
		this.alive = 2
	}
	
	Update( map,targets )
	{
		this.rot += this.spinSpd
		
		this.pos = this.spinParent.pos.Copy()
		this.pos.x += Math.cos( this.rot ) * this.spinRange
		this.pos.y += Math.sin( this.rot ) * this.spinRange
		
		for( const target of targets )
		{
			if( this.CheckOverlap( target ) && target.hp > 0 &&
				!this.hitEnemies.includes( target ) )
			{
				this.HandleHit( target )
			}
		}
		
		for( let i = 0; i < this.dmgCounters.length; ++i )
		{
			if( this.dmgCounters[i].Update() )
			{
				this.dmgCounters.splice( i,1 )
				this.hitEnemies.splice( i,1 )
				--i
			}
		}
		
		--this.alive
	}
	
	HandleHit( target )
	{
		++this.hp
		const prevHitEnemies = this.hitEnemies.length
		super.HandleHit( target )
		if( prevHitEnemies != this.hitEnemies.length )
		{
			this.dmgCounters.push( new Timer( this.dmgInterval ) )
		}
	}
	
	KeepAlive()
	{
		this.alive = 2
	}
	
	IsDead()
	{
		return( this.alive < 1 )
	}
}