class ParticleHandler
{
	constructor()
	{
		this.parts = []
	}
	
	Update()
	{
		const info = {}
		for( const part of this.parts ) part.Update( info )
	}
	
	Draw( gfx )
	{
		for( const part of this.parts ) part.Draw( gfx )
	}
	
	AddPart( part )
	{
		this.parts.push( part )
	}
	
	AddParts( list )
	{
		for( const part of list ) this.parts.push( part )
	}
	
	GetParts()
	{
		return( this.parts )
	}
}