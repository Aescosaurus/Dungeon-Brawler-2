class Entity
{
	constructor( pos,size,hp = 1 )
	{
		this.pos = pos.Copy()
		this.size = size.Copy()
		
		this.col = "#FF00FF"
		
		this.maxHP = hp
		this.hp = hp
		this.dir = 1
		this.moveVec = Vec2.Zero()
	}
	
	Update() {}
	
	Draw( gfx )
	{
		gfx.DrawRect( this.pos.x - this.size.x / 2,this.pos.y - this.size.y / 2,
			this.size.x,this.size.y,this.col )
	}
	
	TryMove( move,map )
	{
		const spots = []
		
		const hSize = this.size.Copy().Divide( 2 )
		spots.push( this.pos.Copy().Subtract( hSize ) )
		spots.push( this.pos.Copy().Add( new Vec2( hSize.x,-hSize.y ) ) )
		spots.push( this.pos.Copy().Add( new Vec2( -hSize.x,hSize.y ) ) )
		spots.push( this.pos.Copy().Add( hSize ) )
		
		function CheckOverlap( offset = Vec2.Zero() )
		{
			for( const spot of spots )
			{
				const tilePos = map.World2TilePos( spot.Copy().Add( offset ) )
				if( !map.IsWalkableTile( tilePos.x,tilePos.y ) )
				{
					return( true )
				}
			}
			return( false )
		}
		
		const step = 0.1
		
		const xDir = Math.sign( move.x )
		const yDir = Math.sign( move.y )
		
		let xMove = Math.abs( move.x )
		while( xMove >= 0 && CheckOverlap( new Vec2( xMove * xDir,0 ) ) )
		{
			xMove -= step
		}
		
		let yMove = Math.abs( move.y )
		while( yMove >= 0 && CheckOverlap( new Vec2( 0,yMove * yDir ) ) )
		{
			yMove -= step
		}
		
		if( !CheckOverlap( new Vec2( xMove * xDir,0 ) ) ) this.pos.x += xMove * xDir
		if( !CheckOverlap( new Vec2( 0,yMove * yDir ) ) ) this.pos.y += yMove * yDir
		
		if( !Utils.RoughlyEquals( move.x,0 ) ) this.dir = Math.sign( move.x )
		this.moveVec = move.Copy()
	}
	
	Damage( dmg,attacker )
	{
		this.hp -= dmg
	}
	
	Heal( amount,healer )
	{
		amount = Math.abs( amount )
		const missingHP = this.maxHP - this.hp
		if( amount > missingHP ) amount = missingHP
		this.hp += amount
		return( amount > 0 )
	}
	
	CheckOverlap( other )
	{
		const center = this.pos.Copy().Subtract( this.size.Copy().Divide( 2 ) )
		const otherCenter = other.pos.Copy().Subtract( other.size.Copy().Divide( 2 ) )
		// return( this.pos.x + this.size.x > other.pos.x && this.pos.x < other.pos.x + other.size.x &&
		// 	this.pos.y + this.size.y > other.pos.y && this.pos.y < other.pos.y + other.size.y )
		return( center.x + this.size.x > otherCenter.x && center.x < otherCenter.x + other.size.x &&
			center.y + this.size.y > otherCenter.y && center.y < otherCenter.y + other.size.y )
	}
	
	IsDead()
	{
		return( this.hp <= 0 )
	}
	
	GetMoveVec()
	{
		return( this.moveVec )
	}
}