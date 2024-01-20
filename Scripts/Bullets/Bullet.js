class Bullet extends Entity
{
	constructor( pos,ang,spd,range = 50,spr = null )
	{
		super( pos,Vec2.One().Scale( 4 ) )
		this.col = "red"
		this.hp = 1
		this.angle = ang * ( 180 / Math.PI )
		
		this.vel = new Vec2( Math.cos( ang ),Math.sin( ang ) ).Scale( spd )
		
		this.range = range
		this.dmg = 1
		
		this.hitEnemies = []
		
		this.spr = spr
		this.rotate = false
		this.rotateOffset = 0
	}
	
	Update( map,targets )
	{
		this.pos.Add( this.vel )
		
		this.range -= Math.abs( this.vel.x )
		this.range -= Math.abs( this.vel.y )
		
		const tilePos = map.World2TilePos( this.pos.Copy() )
		if( !map.IsTileOnScreen( tilePos.x,tilePos.y ) ||
			!map.IsWalkableTile( tilePos.x,tilePos.y ) )
		{
			this.hp = -1
		}
		
		for( const target of targets )
		{
			if( this.CheckOverlap( target ) && target.hp > 0 )
			{
				if( !this.hitEnemies.includes( target ) )
				{
					--this.hp
					target.hp -= this.dmg
					
					if( this.hp > 0 ) this.hitEnemies.push( target )
					
					break
				}
			}
		}
	}
	
	Draw( gfx )
	{
		if( this.spr != null )
		{
			if( this.rotate )
			{
				gfx.DrawSpriteRotated( this.pos.x,this.pos.y,
					this.spr,this.angle + this.rotateOffset )
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
	
	IsDead()
	{
		return( this.range < 0 || this.hp <= 0 )
	}
}