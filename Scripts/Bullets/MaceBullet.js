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
		
		this.partDir = Vec2.Zero()
	}
	
	Update( map,targets )
	{
		const lastPos = this.pos.Copy()
		
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
		
		this.partDir = this.pos.Copy().Subtract( lastPos )
		
		const tilePos = map.World2TilePos( this.pos.Copy() )
		if( map.IsTileOnScreen( tilePos.x,tilePos.y ) ) map.StepOnTile( tilePos.x,tilePos.y )
	}
	
	HandleHit( target )
	{
		++this.hp
		const prevHitEnemies = this.hitEnemies.length
		super.HandleHit( target,false )
		if( prevHitEnemies != this.hitEnemies.length )
		{
			this.dmgCounters.push( new Timer( this.dmgInterval ) )
		}
		
		const nParts = Math.floor( Bullet.hitPartSpawnRange.GetRandVal() * this.dmg )
		const hitCols = target.GetHitColors()
		for( let i = 0; i < nParts; ++i )
		{
			ParticleHandler.Get().AddPart( new EnemyHitParticle(
				this.pos,this.partDir,hitCols,this.dmg ) )
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