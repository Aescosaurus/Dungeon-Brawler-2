class Bullet extends Entity
{
	// takes ang in radians
	constructor( pos,ang,spd,range = 50,spr = null )
	{
		super( pos,Vec2.One().Scale( 4 ) )
		this.col = "red"
		this.hp = 1
		this.angle = Utils.Rad2Deg( ang )
		this.parent = null
		
		this.vel = new Vec2( Math.cos( ang ),Math.sin( ang ) ).Scale( spd )
		
		this.range = range
		this.dmg = 1
		
		this.hitEnemies = []
		
		this.spr = spr
		this.rotate = false
		this.rotateOffset = 0
		
		this.rot = 0
		this.rotSpd = 0
		
		this.spd = spd
		this.seekTarget = null
		this.canOnlyHitTarget = false
		
		this.bulletScale = Vec2.One()
		this.ignoreWalls = false
		this.triggerPierce = true
	}
	
	Update( map,targets )
	{
		if( this.seekTarget )
		{
			this.vel = ( this.seekTarget.pos.Copy().Subtract( this.pos ) )
				.Normalize().Scale( this.spd )
		}
		
		this.pos.Add( this.vel )
		
		this.range -= Math.abs( this.vel.x )
		this.range -= Math.abs( this.vel.y )
		
		const tilePos = map.World2TilePos( this.pos.Copy() )
		if( !this.ignoreWalls &&
			( !map.IsTileOnScreen( tilePos.x,tilePos.y ) ||
			!map.IsWalkableTile( tilePos.x,tilePos.y ) ) )
			// map.GetTile( tilePos.x,tilePos.y ) == 1 ) )
		{
			this.hp = -1
		}
		
		if( map.IsTileOnScreen( tilePos.x,tilePos.y ) ) map.StepOnTile( tilePos.x,tilePos.y )
		
		if( this.canOnlyHitTarget )
		{
			if( this.CheckOverlap( this.seekTarget ) ) this.HandleHit( this.seekTarget )
		}
		else
		{
			for( const target of targets )
			{
				if( this.CheckOverlap( target ) && target.hp > 0 &&
					!this.hitEnemies.includes( target ) )
				{
					this.HandleHit( target )
					break
				}
			}
		}
		
		this.rot += this.rotSpd
	}
	
	Draw( gfx )
	{
		if( this.spr != null )
		{
			if( this.rotate || this.rot != 0 )
			{
				// gfx.DrawSpriteRotated( this.pos.x,this.pos.y,
				// 	this.spr,this.angle + this.rotateOffset + this.rot )
				gfx.DrawSpriteRotatedScaled( this.pos.x,this.pos.y,
					this.spr,
					this.bulletScale.x,this.bulletScale.y,
					this.angle + this.rotateOffset + this.rot )
			}
			else if( !this.bulletScale.Equals( Vec2.One() ) )
			{
				gfx.DrawSpriteRotatedScaled( this.pos.x,this.pos.y,
					this.spr,
					this.bulletScale.x,this.bulletScale.y,
					0 )
			}
			else
			{
				gfx.DrawSprite( this.pos.x - this.spr.width / 2,this.pos.y - this.spr.height / 2,
					this.spr )
			}
		}
		else
		{
			super.Draw( gfx )
		}
	}
	
	HandleHit( target,spawnParts = true )
	{
		let consumeHP = false
		if( this.dmg > 0 )
		{
			target.Damage( this.dmg,this.parent )
			consumeHP = true
			
			if( spawnParts )
			{
				const nParts = Math.floor( Bullet.hitPartSpawnRange.GetRandVal() *
					Math.max( 1,this.dmg ) )
				const hitCols = target.GetHitColors()
				for( let i = 0; i < nParts; ++i )
				{
					ParticleHandler.Get().AddPart( new EnemyHitParticle(
						this.pos,this.vel,hitCols,this.dmg ) )
				}
			}
		}
		else if( target.Heal( Math.abs( this.dmg ),this.parent ) )
		{
			consumeHP = true
		}
		
		if( consumeHP )
		{
			--this.hp
			this.hitEnemies.push( target )
		}
		
		if( this.parent && this.parent.isPlayer )
		{
			this.parent.OnEnemyHit( target )
			if( target.IsDead() ) this.parent.OnEnemyKill( target )
			// this will trigger every subsequent hit (2,3,4,etc) but I think that's fine
			if( this.hitEnemies.length >= 2 && this.triggerPierce )
			{
				this.parent.OnPierce( target,this.hitEnemies.length )
			}
		}
	}
	
	SetSeekTarget( target )
	{
		this.seekTarget = target
	}
	
	SetIgnoreWalls( ignore = true )
	{
		this.ignoreWalls = ignore
	}
	
	SetTriggerPierce( pierce )
	{
		this.triggerPierce = pierce
	}
	
	ScaleUp( scale )
	{
		this.bulletScale = Vec2.One().Scale( scale )
	}
	
	// handle overlap for bigger bullets
	CheckOverlap( other )
	{
		const mySize = this.size.Copy().MultiplyVec( this.bulletScale )
		
		const center = this.pos.Copy().Subtract( mySize.Copy().Divide( 2 ) )
		const otherCenter = other.pos.Copy().Subtract( other.size.Copy().Divide( 2 ) )
		
		return( center.x + mySize.x > otherCenter.x && center.x < otherCenter.x + other.size.x &&
			center.y + mySize.y > otherCenter.y && center.y < otherCenter.y + other.size.y )
	}
	
	IsDead()
	{
		return( this.range < 0 || this.hp <= 0 )
	}
}

Bullet.hitPartSpawnRange = new Range( 2,5 )