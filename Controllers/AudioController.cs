using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;

namespace CSE325_Team12_Project.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class AudioController : ControllerBase
    {
        [HttpPost("upload")]
        public async Task<IActionResult> UploadAudio(IFormFile audio)
        {
            if (audio == null || audio.Length == 0)
                return BadRequest("No audio file provided");

            var fileName = $"{Guid.NewGuid()}.webm";
            var filePath = Path.Combine("wwwroot/audio", fileName);
            
            Directory.CreateDirectory(Path.GetDirectoryName(filePath)!);
            
            using var stream = new FileStream(filePath, FileMode.Create);
            await audio.CopyToAsync(stream);

            return Ok(new { audioUrl = $"/audio/{fileName}" });
        }
    }
}